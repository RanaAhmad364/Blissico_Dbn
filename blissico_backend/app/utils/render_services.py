import os
import textwrap
from PIL import Image, ImageDraw, ImageFont
from flask import current_app

FONT_FILES = {
    "Poppins": ("Poppins-Regular.ttf", "Poppins-Bold.ttf"),
    "Playfair Display": ("PlayfairDisplay-Regular.ttf", "PlayfairDisplay-Bold.ttf"),
    "Arial": ("DejaVuSans.ttf", "DejaVuSans-Bold.ttf"),
    "Georgia": ("Gelasio-Regular.ttf", "Gelasio-Bold.ttf"),
}

EDITOR_CANVAS_WIDTH = 450


class RenderService:
    """
    Composites a saved CardCustomization onto its card's template image, so
    downloads reflect what the user actually designed, not the blank template.

    Known simplifications (documented, not silent): letter-spacing and italic
    slant aren't rendered here — Pillow has no native support for either
    without manual per-character positioning or a dedicated italic font file.
    Both still work correctly in the live browser preview; this only affects
    the final downloaded image. Bold, color, alignment, position, and
    underline are all real.
    """

    @staticmethod
    def _font_path(font_family, bold):
        regular, bold_file = FONT_FILES.get(font_family, FONT_FILES["Poppins"])
        filename = bold_file if bold else regular
        path = os.path.join(current_app.root_path, "static", "fonts", filename)
        return path if os.path.exists(path) else None

    @staticmethod
    def _load_font(font_family, bold, size):
        path = RenderService._font_path(font_family, bold)
        try:
            return ImageFont.truetype(path, size) if path else ImageFont.load_default()
        except Exception:
            return ImageFont.load_default()

    @staticmethod
    def render(template_path, customization):
        base = Image.open(template_path).convert("RGBA")
        draw = ImageDraw.Draw(base)
        img_w, img_h = base.size

        # The live editor always renders at a fixed 450px-wide canvas — scale
        # the saved font size up (or down) to match the real image's resolution.
        scale = img_w / EDITOR_CANVAS_WIDTH
        print(f"[RENDER DEBUG] img_w={img_w}, scale={scale}, scaled_font_size={round(customization.font_size * scale)}")
        scaled_font_size = max(1, round(customization.font_size * scale))

        font = RenderService._load_font(customization.font_family, customization.bold, scaled_font_size)
        text = customization.greeting_text or ""

        avg_char_w = font.getlength("MW") / 2 if hasattr(font, "getlength") else scaled_font_size * 0.6
        max_chars = max(1, int((img_w * 0.8) / max(avg_char_w, 1)))
        lines = []
        for raw_line in text.split("\n"):
            lines.extend(textwrap.wrap(raw_line, width=max_chars) or [""])

        line_height = int(scaled_font_size * (customization.line_height or 1.2))
        total_height = line_height * len(lines)

        anchor_x = img_w * (customization.position_x / 100)
        anchor_y = img_h * (customization.position_y / 100)
        start_y = anchor_y - (total_height / 2)

        color = customization.font_color or "#000000"

        for i, line in enumerate(lines):
            bbox = draw.textbbox((0, 0), line, font=font)
            line_w = bbox[2] - bbox[0]

            if customization.alignment == "left":
                x = anchor_x - (img_w * 0.4)
            elif customization.alignment == "right":
                x = anchor_x + (img_w * 0.4) - line_w
            else:
                x = anchor_x - (line_w / 2)

            y = start_y + i * line_height
            draw.text((x, y), line, font=font, fill=color)

            if customization.underline:
                underline_y = y + bbox[3] + 2
                draw.line([(x, underline_y), (x + line_w, underline_y)], fill=color, width=max(1, scaled_font_size // 20))

        return base

