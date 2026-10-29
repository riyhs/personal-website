#!/usr/bin/env python3
"""Export the AritmaPlay digit CNN weights and optional Keras parity fixtures.

Source: https://github.com/AritmaPlay/aritmaplay-ml-api/blob/main/model/model.h5
Pinned content:
  git blob 417f9d3f59abe22a529f3b807e72fad2803e317a
  commit   cf311ad2cd3d50a58e578cb030d0f10318fe28d9
  sha256   0d7f3296e185eb597c046d74cc0c0c771624952c3fd0a7f505e6e0e8b621a9d1

Usage:
  uv run --with h5py --with numpy scripts/export-digit-model.py
  uv run --with h5py --with 'numpy==1.26.4' --with 'tensorflow-cpu==2.17.1' --with 'keras==3.5.0' scripts/export-digit-model.py --fixtures

The first command writes public/models/bangkit-digit-weights.bin plus a manifest.
The second also writes src/lib/__fixtures__/digitParity.json using TensorFlow.
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import tempfile
import urllib.request
from pathlib import Path

import h5py
import numpy as np

SOURCE_URL = "https://github.com/AritmaPlay/aritmaplay-ml-api/blob/main/model/model.h5"
RAW_URL = "https://raw.githubusercontent.com/AritmaPlay/aritmaplay-ml-api/main/model/model.h5"
BLOB_SHA = "417f9d3f59abe22a529f3b807e72fad2803e317a"
COMMIT_SHA = "cf311ad2cd3d50a58e578cb030d0f10318fe28d9"
MODEL_SHA256 = "0d7f3296e185eb597c046d74cc0c0c771624952c3fd0a7f505e6e0e8b621a9d1"

WEIGHT_SPECS = [
    ("conv1Kernel", "model_weights/conv2d_2/sequential_1/conv2d_2/kernel", (3, 3, 1, 32)),
    ("conv1Bias", "model_weights/conv2d_2/sequential_1/conv2d_2/bias", (32,)),
    ("conv2Kernel", "model_weights/conv2d_3/sequential_1/conv2d_3/kernel", (3, 3, 32, 16)),
    ("conv2Bias", "model_weights/conv2d_3/sequential_1/conv2d_3/bias", (16,)),
    ("denseKernel", "model_weights/dense_1/sequential_1/dense_1/kernel", (1600, 10)),
    ("denseBias", "model_weights/dense_1/sequential_1/dense_1/bias", (10,)),
]

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_WEIGHTS = ROOT / "public/models/bangkit-digit-weights.bin"
DEFAULT_MANIFEST = ROOT / "public/models/bangkit-digit-weights.json"
DEFAULT_FIXTURES = ROOT / "src/lib/__fixtures__/digitParity.json"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def download(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "riyaldi.dev-digit-demo"})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read()


def get_model_bytes(model_path: Path | None) -> bytes:
    if model_path is not None:
        data = model_path.read_bytes()
    else:
        print(f"Downloading {RAW_URL}")
        data = download(RAW_URL)

    digest = sha256(data)
    if digest != MODEL_SHA256:
        raise SystemExit(
            f"model.h5 checksum mismatch: expected {MODEL_SHA256}, got {digest}. "
            "Refusing to export weights from a different file."
        )
    print(f"Verified model.h5: {len(data)} bytes, sha256 {digest}")
    return data


def export_weights(model_bytes: bytes, out_path: Path, manifest_path: Path) -> str:
    parts: list[np.ndarray] = []
    shapes: dict[str, list[int]] = {}

    with h5py.File(io.BytesIO(model_bytes), "r") as model_file:
        keras_version = model_file.attrs.get("keras_version", "unknown")
        print(f"Keras version: {keras_version}")

        for name, h5_path, expected_shape in WEIGHT_SPECS:
            if h5_path not in model_file:
                raise SystemExit(f"Missing HDF5 dataset: {h5_path}")
            values = model_file[h5_path][...]
            if values.shape != expected_shape:
                raise SystemExit(
                    f"{name}: expected shape {expected_shape}, got {values.shape}"
                )
            parts.append(values.astype("<f4", copy=False).ravel(order="C"))
            shapes[name] = list(expected_shape)

    weights = np.concatenate(parts)
    if weights.size != 20954:
        raise SystemExit(f"Expected 20954 weights, got {weights.size}")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    weights.tofile(out_path)

    weights_bytes = out_path.read_bytes()
    weights_sha = sha256(weights_bytes)
    manifest = {
        "source": SOURCE_URL,
        "raw": RAW_URL,
        "blobSha": BLOB_SHA,
        "commit": COMMIT_SHA,
        "modelSha256": MODEL_SHA256,
        "kerasVersion": str(keras_version),
        "weights": out_path.name,
        "weightsSha256": weights_sha,
        "bytes": len(weights_bytes),
        "weightsCount": int(weights.size),
        "shapes": shapes,
    }
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")

    print(f"Wrote {out_path} ({len(weights_bytes)} bytes, {weights.size} weights)")
    print(f"Wrote {manifest_path}")
    print(f"weights sha256: {weights_sha}")
    return weights_sha


def make_fixtures(model_bytes: bytes, weights_sha: str, fixtures_path: Path) -> None:
    import tensorflow as tf

    print(f"TensorFlow {tf.__version__} / Keras {tf.keras.__version__}")

    with tempfile.TemporaryDirectory() as temp_dir:
        model_path = Path(temp_dir) / "model.h5"
        model_path.write_bytes(model_bytes)
        model = tf.keras.models.load_model(model_path)

    if model.input_shape != (None, 48, 48, 1):
        raise SystemExit(f"Unexpected model input shape: {model.input_shape}")

    rng = np.random.default_rng(20261029)
    white = np.full((48, 48), 255, dtype=np.uint8)
    black = np.zeros((48, 48), dtype=np.uint8)
    bar = white.copy()
    bar[8:40, 21:27] = 0
    seven = white.copy()
    seven[8:14, 10:38] = 0
    seven[8:40, 32:38] = 0
    noise = rng.integers(0, 256, (48, 48), dtype=np.uint8)

    samples = [
        ("white", white),
        ("black", black),
        ("bar", bar),
        ("seven", seven),
        ("noise", noise),
    ]

    batch = np.stack([sample for _, sample in samples])[..., None].astype(np.float32)
    expected = model.predict(batch, verbose=0)
    if expected.shape != (len(samples), 10):
        raise SystemExit(f"Unexpected prediction shape: {expected.shape}")

    fixture = {
        "source": SOURCE_URL,
        "modelSha256": MODEL_SHA256,
        "weightsSha256": weights_sha,
        "samples": [
            {
                "name": name,
                "input": sample.ravel().tolist(),
                "expected": [float(value) for value in output],
            }
            for (name, sample), output in zip(samples, expected, strict=True)
        ],
    }

    fixtures_path.parent.mkdir(parents=True, exist_ok=True)
    fixtures_path.write_text(json.dumps(fixture, separators=(",", ":")) + "\n")
    print(f"Wrote {fixtures_path} ({len(samples)} samples)")

    for sample, output in zip(samples, expected, strict=True):
        digit = int(np.argmax(output))
        print(f"  {sample[0]}: digit {digit} ({float(output[digit]):.4f})")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--model", type=Path, help="Use a local model.h5 instead of downloading")
    parser.add_argument("--out", type=Path, default=DEFAULT_WEIGHTS)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument(
        "--fixtures",
        nargs="?",
        const=DEFAULT_FIXTURES,
        type=Path,
        help="Also write Keras parity fixtures (requires TensorFlow)",
    )
    args = parser.parse_args()

    model_bytes = get_model_bytes(args.model)
    weights_sha = export_weights(model_bytes, args.out, args.manifest)
    if args.fixtures is not None:
        make_fixtures(model_bytes, weights_sha, args.fixtures)


if __name__ == "__main__":
    main()
