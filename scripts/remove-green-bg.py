from collections import deque
from pathlib import Path
import sys

import numpy as np
from PIL import Image, ImageFilter


def remove_green(src: Path, out: Path, preview: Path | None = None, bg: str = "#ffffff") -> None:
    image = Image.open(src).convert("RGBA")
    data = np.array(image)
    red = data[:, :, 0].astype(np.int16)
    green = data[:, :, 1].astype(np.int16)
    blue = data[:, :, 2].astype(np.int16)

    candidate = (green > 150) & ((green - red) > 70) & ((green - blue) > 70)
    height, width = candidate.shape
    seen = np.zeros((height, width), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        if candidate[0, x]:
            seen[0, x] = True
            queue.append((0, x))
        if candidate[height - 1, x]:
            seen[height - 1, x] = True
            queue.append((height - 1, x))

    for y in range(height):
        if candidate[y, 0] and not seen[y, 0]:
            seen[y, 0] = True
            queue.append((y, 0))
        if candidate[y, width - 1] and not seen[y, width - 1]:
            seen[y, width - 1] = True
            queue.append((y, width - 1))

    while queue:
        y, x = queue.popleft()
        for next_y, next_x in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if (
                0 <= next_y < height
                and 0 <= next_x < width
                and candidate[next_y, next_x]
                and not seen[next_y, next_x]
            ):
                seen[next_y, next_x] = True
                queue.append((next_y, next_x))

    background_mask = Image.fromarray((seen * 255).astype(np.uint8), "L")
    background_mask = background_mask.filter(ImageFilter.MaxFilter(5))

    alpha = 255 - np.array(background_mask)
    alpha[candidate] = 0
    alpha_image = Image.fromarray(alpha.astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(0.25))

    output = data.copy()
    output[:, :, 3] = np.array(alpha_image)

    edge = (output[:, :, 3] > 0) & (output[:, :, 3] < 255)
    output[:, :, 1] = np.where(
        edge,
        np.minimum(output[:, :, 1], np.maximum(output[:, :, 0], output[:, :, 2]) + 8),
        output[:, :, 1],
    )

    result = Image.fromarray(output, "RGBA")
    result.save(out, optimize=True)

    if preview is not None:
        preview_bg = Image.new("RGBA", image.size, bg)
        preview_bg.alpha_composite(result)
        preview_bg.save(preview)


if __name__ == "__main__":
    source, output, preview, bg = sys.argv[1:5]
    remove_green(Path(source), Path(output), Path(preview), bg)
