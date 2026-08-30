import os
import textwrap
from PIL import Image, ImageDraw, ImageFont, ImageSequence
import io
from flask import current_app



FONT_FILES = {
    "Poppins": {
        "regular": "Poppins-Regular.ttf",
        "bold": "Poppins-Bold.ttf",
        "italic": "Poppins-Italic.ttf",
        "bold_italic": "Poppins-BoldItalic.ttf",
    },
    "Playfair Display": {
        "regular": "PlayfairDisplay-Regular.ttf",
        "bold": "PlayfairDisplay-Bold.ttf",
        "italic": "PlayfairDisplay-Italic.ttf",
        "bold_italic": "PlayfairDisplay-BoldItalic.ttf",
    },
    "Arial": {
        "regular": "DejaVuSans.ttf",
        "bold": "DejaVuSans-Bold.ttf",
        "italic": "DejaVuSerif-Italic.ttf",
        "bold_italic": "DejaVuSerif-BoldItalic.ttf",
    },
    "Georgia": {
        "regular": "Gelasio-Regular.ttf",
        "bold": "Gelasio-Bold.ttf",
        "italic": "Gelasio-Italic.ttf",
        "bold_italic": "Gelasio-BoldItalic.ttf",
    },
}

EDITOR_CANVAS_WIDTH = 450
EDITOR_TEXT_MAX_WIDTH = 320

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
    def _font_path(font_family, bold=False, italic=False):
        family = FONT_FILES.get(font_family, FONT_FILES["Poppins"])
        
        if bold and italic:
            filename = family.get("bold_italic", family["bold"])
        elif bold:
            filename = family["bold"]
        elif italic:
            filename = family.get("italic", family["regular"])
        else:
            filename = family["regular"]

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
    def _wrap_text(draw, text, font, max_width):
        lines = []
        for raw_line in text.split("\n"):
            words = raw_line.split(" ")
            if not words:
                lines.append("")
                continue
            current = words[0]
            for word in words[1:]:
                candidate = f"{current} {word}"
                if draw.textlength(candidate, font=font) <= max_width:
                    current = candidate
                else:
                    lines.append(current)
                    current = word
            lines.append(current)
        return lines    

    # @staticmethod
    # def render(template_path, customization):
    #     base = Image.open(template_path).convert("RGBA")
    #     draw = ImageDraw.Draw(base)
    #     img_w, img_h = base.size

    #     # The live editor always renders at a fixed 450px-wide canvas — scale
    #     # the saved font size up (or down) to match the real image's resolution.
    #     scale = img_w / EDITOR_CANVAS_WIDTH
    #     print(f"[RENDER DEBUG] img_w={img_w}, scale={scale}, scaled_font_size={round(customization.font_size * scale)}")
    #     scaled_font_size = max(1, round(customization.font_size * scale))

    #     font = RenderService._load_font(customization.font_family, customization.bold, scaled_font_size)
    #     text = customization.greeting_text or ""

    #     max_width = EDITOR_TEXT_MAX_WIDTH * scale
    #     lines = RenderService._wrap_text(draw, text, font, max_width)

    #     line_height = int(scaled_font_size * (customization.line_height or 1.2))
    #     total_height = line_height * len(lines)

    #     anchor_x = img_w * (customization.position_x / 100)
    #     anchor_y = img_h * (customization.position_y / 100)
    #     start_y = anchor_y - (total_height / 2)

    #     color = customization.font_color or "#000000"

    #     for i, line in enumerate(lines):
    #         bbox = draw.textbbox((0, 0), line, font=font)
    #         line_w = bbox[2] - bbox[0]

    #         if customization.alignment == "left":
    #             x = anchor_x - (img_w * 0.4)
    #         elif customization.alignment == "right":
    #             x = anchor_x + (img_w * 0.4) - line_w
    #         else:
    #             x = anchor_x - (line_w / 2)

    #         y = start_y + i * line_height
    #         draw.text((x, y), line, font=font, fill=color)

    #         if customization.underline:
    #             underline_y = y + bbox[3] + 2
    #             draw.line([(x, underline_y), (x + line_w, underline_y)], fill=color, width=max(1, scaled_font_size // 20))

    #     return base

    @staticmethod
    def _draw_text_on_frame(base, customization):
        """Composites the saved customization onto ONE already-open Pillow image (a single frame)."""
        base = base.convert("RGBA")
        draw = ImageDraw.Draw(base)
        img_w, img_h = base.size

        scale = img_w / RenderService.EDITOR_CANVAS_WIDTH
        scaled_font_size = max(1, round(customization.font_size * scale))
        font = RenderService._load_font(customization.font_family, customization.bold, customization.italic, scaled_font_size)

        text = customization.greeting_text or ""
        max_width = RenderService.EDITOR_TEXT_MAX_WIDTH * scale
        lines = RenderService._wrap_text(draw, text, font, max_width)

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

    @staticmethod
    def render(template_path, customization):
        """Static image path — used by 'image' and 'pdf' downloads."""
        base = Image.open(template_path)
        return RenderService._draw_text_on_frame(base, customization)

    @staticmethod
    def render_gif(gif_path, customization):
        """Animated path — draws the SAME text onto every frame, preserving timing and loop."""
        im = Image.open(gif_path)
        composited_frames = []
        durations = []

        for frame in ImageSequence.Iterator(im):
            composited = RenderService._draw_text_on_frame(frame.copy(), customization)
            composited_frames.append(composited.convert("P", palette=Image.ADAPTIVE))
            durations.append(frame.info.get("duration", 100))

        buf = io.BytesIO()
        composited_frames[0].save(
            buf, format="GIF", save_all=True, append_images=composited_frames[1:],
            duration=durations, loop=im.info.get("loop", 0), disposal=2,
        )
        return buf.getvalue()

