import os
import io
from PIL import Image, ImageDraw, ImageFont, ImageSequence
from flask import current_app


# AUTO-GENERATED / VERIFIED AGAINST fonts(1).zip
# Expected directory:
#   app/static/fonts/
#
# IMPORTANT:
# The filenames below use the exact case/spelling from the ZIP.
# Where the ZIP does not contain a separate bold/italic variant,
# the closest available font file is used.

FONT_FILES = {
    "SaolDisplay": {
        "regular": "SaolDisplay-Regular.ttf",
        "bold": "SaolDisplay-Regular.ttf",
        "italic": "SaolDisplay-Regular.ttf",
        "bold_italic": "SaolDisplay-Regular.ttf",
    },
    "NeueMontreal": {
        "regular": "NeueMontreal-Regular.otf",
        "bold": "NeueMontreal-Medium.otf",
        "italic": "NeueMontreal-MediumItalic.otf",
        "bold_italic": "NeueMontreal-Medium.otf",
    },
    "Playfair Display": {
        "regular": "PlayfairDisplay-Regular.ttf",
        "bold": "PlayfairDisplay-Regular.ttf",
        "italic": "PlayfairDisplay-Italic.ttf",
        "bold_italic": "PlayfairDisplay-Italic.ttf",
    },
    "Cinzel Decorative": {
        "regular": "CinzelDecorative-Regular.otf",
        "bold": "CinzelDecorative-Regular.otf",
        "italic": "CinzelDecorative-Regular.otf",
        "bold_italic": "CinzelDecorative-Regular.otf",
    },
    "Cormorant Garamond": {
        "regular": "CormorantGaramond-Regular.ttf",
        "bold": "CormorantGaramond-Medium.ttf",
        "italic": "CormorantGaramond-Regular.ttf",
        "bold_italic": "CormorantGaramond-Medium.ttf",
    },
    "Cormorant Infant": {
        "regular": "CormorantInfant-SemiBold.ttf",
        "bold": "CormorantInfant-SemiBold.ttf",
        "italic": "CormorantInfant-SemiBold.ttf",
        "bold_italic": "CormorantInfant-SemiBold.ttf",
    },
    "DM Serif Display": {
        "regular": "DMSerifDisplay-Regular.ttf",
        "bold": "DMSerifDisplay-Regular.ttf",
        "italic": "DMSerifDisplay-Regular.ttf",
        "bold_italic": "DMSerifDisplay-Regular.ttf",
    },
    "Gilda Display": {
        "regular": "GildaDisplay-Regular.ttf",
        "bold": "GildaDisplay-Regular.ttf",
        "italic": "GildaDisplay-Regular.ttf",
        "bold_italic": "GildaDisplay-Regular.ttf",
    },
    "Italiana": {
        "regular": "Italiana-Regular.ttf",
        "bold": "Italiana-Regular.ttf",
        "italic": "Italiana-Regular.ttf",
        "bold_italic": "Italiana-Regular.ttf",
    },
    "Libre Baskerville": {
        "regular": "LibreBaskerville-Regular.ttf",
        "bold": "LibreBaskerville-Medium.ttf",
        "italic": "LibreBaskerville-Italic.ttf",
        "bold_italic": "LibreBaskerville-Medium.ttf",
    },
    "Libre Caslon Display": {
        "regular": "LibreCaslonDisplay-Regular.ttf",
        "bold": "LibreCaslonDisplay-Regular.ttf",
        "italic": "LibreCaslonDisplay-Regular.ttf",
        "bold_italic": "LibreCaslonDisplay-Regular.ttf",
    },
    "Lora": {
        "regular": "Lora-Regular.ttf",
        "bold": "Lora-Regular.ttf",
        "italic": "Lora-Regular.ttf",
        "bold_italic": "Lora-Regular.ttf",
    },
    "Marcellus": {
        "regular": "Marcellus-Regular.ttf",
        "bold": "Marcellus-Regular.ttf",
        "italic": "Marcellus-Regular.ttf",
        "bold_italic": "Marcellus-Regular.ttf",
    },
    "Newsreader": {
        "regular": "Newsreader_24pt-Regular.ttf",
        "bold": "Newsreader_24pt-Regular.ttf",
        "italic": "Newsreader_24pt-Regular.ttf",
        "bold_italic": "Newsreader_24pt-Regular.ttf",
    },
    "Prata": {
        "regular": "Prata-Regular.ttf",
        "bold": "Prata-Regular.ttf",
        "italic": "Prata-Regular.ttf",
        "bold_italic": "Prata-Regular.ttf",
    },
    "Vidaloka": {
        "regular": "Vidaloka-Regular.ttf",
        "bold": "Vidaloka-Regular.ttf",
        "italic": "Vidaloka-Regular.ttf",
        "bold_italic": "Vidaloka-Regular.ttf",
    },
    "Times New Roman": {
        "regular": "times.ttf",
        "bold": "times.ttf",
        "italic": "timesi.ttf",
        "bold_italic": "timesi.ttf",
    },
    "Poppins": {
        "regular": "Poppins-Regular.otf",
        "bold": "Poppins-Bold.ttf",
        "italic": "Poppins-Italic.ttf",
        "bold_italic": "Poppins-BoldItalic.ttf",
    },
    "Montserrat": {
        "regular": "Montserrat-Regular.ttf",
        "bold": "Montserrat-Medium.ttf",
        "italic": "Montserrat-Regular.ttf",
        "bold_italic": "Montserrat-Medium.ttf",
    },
    "Open Sans": {
        "regular": "OpenSans-Regular.ttf",
        "bold": "OpenSans-Regular.ttf",
        "italic": "OpenSans-Regular.ttf",
        "bold_italic": "OpenSans-Regular.ttf",
    },
    "DM Sans": {
        "regular": "DMSans_36pt-Regular.ttf",
        "bold": "DMSans_36pt-Regular.ttf",
        "italic": "DMSans_36pt-Regular.ttf",
        "bold_italic": "DMSans_36pt-Regular.ttf",
    },
    "Work Sans": {
        "regular": "WorkSans-Medium.ttf",
        "bold": "WorkSans-Medium.ttf",
        "italic": "WorkSans-Medium.ttf",
        "bold_italic": "WorkSans-Medium.ttf",
    },
    "Raleway": {
        "regular": "Raleway Medium.ttf",
        "bold": "Raleway Medium.ttf",
        "italic": "Raleway Medium.ttf",
        "bold_italic": "Raleway Medium.ttf",
    },
    "Questrial": {
        "regular": "Questrial-Regular.ttf",
        "bold": "Questrial-Regular.ttf",
        "italic": "Questrial-Regular.ttf",
        "bold_italic": "Questrial-Regular.ttf",
    },
    "Oswald": {
        "regular": "Oswald-Light.ttf",
        "bold": "Oswald-Medium.ttf",
        "italic": "Oswald-Light.ttf",
        "bold_italic": "Oswald-Medium.ttf",
    },
    "Comfortaa": {
        "regular": "Comfortaa-Regular.ttf",
        "bold": "Comfortaa-Bold.ttf",
        "italic": "Comfortaa-Regular.ttf",
        "bold_italic": "Comfortaa-Bold.ttf",
    },
    "Comic Neue": {
        "regular": "ComicNeue-Angular-Regular.ttf",
        "bold": "ComicNeue-Angular-Bold.ttf",
        "italic": "ComicNeue-Angular-Regular.ttf",
        "bold_italic": "ComicNeue-Angular-Bold.ttf",
    },
    "Grandstander": {
        "regular": "Grandstander-Medium.ttf",
        "bold": "Grandstander-Medium.ttf",
        "italic": "Grandstander-Medium.ttf",
        "bold_italic": "Grandstander-Medium.ttf",
    },
    "Switzerland": {
        "regular": "Switzerland.ttf",
        "bold": "Switzerland.ttf",
        "italic": "Switzerland.ttf",
        "bold_italic": "Switzerland.ttf",
    },
    "Helvetica": {
        "regular": "Helvetica.ttf",
        "bold": "Helvetica-Bold-Font.ttf",
        "italic": "Helvetica.ttf",
        "bold_italic": "Helvetica-Bold-Font.ttf",
    },
    "Caveat": {
        "regular": "Caveat-Regular.ttf",
        "bold": "Caveat-Regular.ttf",
        "italic": "Caveat-Regular.ttf",
        "bold_italic": "Caveat-Regular.ttf",
    },
    "Kalam": {
        "regular": "Kalam-Regular.ttf",
        "bold": "Kalam-Regular.ttf",
        "italic": "Kalam-Regular.ttf",
        "bold_italic": "Kalam-Regular.ttf",
    },
    "Patrick Hand": {
        "regular": "PatrickHand-Regular.ttf",
        "bold": "PatrickHand-Regular.ttf",
        "italic": "PatrickHand-Regular.ttf",
        "bold_italic": "PatrickHand-Regular.ttf",
    },
    "Amatic SC": {
        "regular": "AmaticSC-Bold.ttf",
        "bold": "AmaticSC-Bold.ttf",
        "italic": "AmaticSC-Bold.ttf",
        "bold_italic": "AmaticSC-Bold.ttf",
    },
    "Alex Brush": {
        "regular": "AlexBrush-Regular.ttf",
        "bold": "AlexBrush-Regular.ttf",
        "italic": "AlexBrush-Regular.ttf",
        "bold_italic": "AlexBrush-Regular.ttf",
    },
    "Great Vibes": {
        "regular": "GreatVibes-Regular.ttf",
        "bold": "GreatVibes-Regular.ttf",
        "italic": "GreatVibes-Regular.ttf",
        "bold_italic": "GreatVibes-Regular.ttf",
    },
    "Dancing Script": {
        "regular": "Dancing Script.ttf",
        "bold": "Dancing Script.ttf",
        "italic": "Dancing Script.ttf",
        "bold_italic": "Dancing Script.ttf",
    },
    "Parisienne": {
        "regular": "Parisienne-Regular.ttf",
        "bold": "Parisienne-Regular.ttf",
        "italic": "Parisienne-Regular.ttf",
        "bold_italic": "Parisienne-Regular.ttf",
    },
    "Pinyon Script": {
        "regular": "PinyonScript-Regular.ttf",
        "bold": "PinyonScript-Regular.ttf",
        "italic": "PinyonScript-Regular.ttf",
        "bold_italic": "PinyonScript-Regular.ttf",
    },
    "Satisfy": {
        "regular": "Satisfy-Regular.ttf",
        "bold": "Satisfy-Regular.ttf",
        "italic": "Satisfy-Regular.ttf",
        "bold_italic": "Satisfy-Regular.ttf",
    },
    "Yellowtail": {
        "regular": "Yellowtail-Regular.ttf",
        "bold": "Yellowtail-Regular.ttf",
        "italic": "Yellowtail-Regular.ttf",
        "bold_italic": "Yellowtail-Regular.ttf",
    },
    "Pacifico": {
        "regular": "Pacifico.ttf",
        "bold": "Pacifico.ttf",
        "italic": "Pacifico.ttf",
        "bold_italic": "Pacifico.ttf",
    },
    "Lobster": {
        "regular": "Lobster.otf",
        "bold": "Lobster.otf",
        "italic": "Lobster.otf",
        "bold_italic": "Lobster.otf",
    },
    "Bright Mirage": {
        "regular": "BrightMirage-R91Ve.ttf",
        "bold": "BrightMirage-R91Ve.ttf",
        "italic": "BrightMirage-R91Ve.ttf",
        "bold_italic": "BrightMirage-R91Ve.ttf",
    },
    "Brittany Signature": {
        "regular": "BrittanySignature.ttf",
        "bold": "BrittanySignature.ttf",
        "italic": "BrittanySignature.ttf",
        "bold_italic": "BrittanySignature.ttf",
    },
    "Brush Signature": {
        "regular": "Brush Signature.ttf",
        "bold": "Brush Signature.ttf",
        "italic": "Brush Signature.ttf",
        "bold_italic": "Brush Signature.ttf",
    },
    "Creative Signature": {
        "regular": "CreativeSignature.ttf",
        "bold": "CreativeSignature.ttf",
        "italic": "CreativeSignature.ttf",
        "bold_italic": "CreativeSignature.ttf",
    },
    "Geraldyne Signature": {
        "regular": "GeraldyneSignature-RpzpW.ttf",
        "bold": "GeraldyneSignature-RpzpW.ttf",
        "italic": "GeraldyneSignature-RpzpW.ttf",
        "bold_italic": "GeraldyneSignature-RpzpW.ttf",
    },
    "Mitogen Signature": {
        "regular": "Mitogen Signature.ttf",
        "bold": "Mitogen Signature.ttf",
        "italic": "Mitogen Signature.ttf",
        "bold_italic": "Mitogen Signature.ttf",
    },
    "Paul Signature": {
        "regular": "Paul Signature.ttf",
        "bold": "Paul Signature.ttf",
        "italic": "Paul Signature.ttf",
        "bold_italic": "Paul Signature.ttf",
    },
    "Yustine Signature": {
        "regular": "Yustine Signature.ttf",
        "bold": "Yustine Signature.ttf",
        "italic": "Yustine Signature.ttf",
        "bold_italic": "Yustine Signature.ttf",
    },
    "Penna Swashes": {
        "regular": "Penna-Swashes.ttf",
        "bold": "Penna-Swashes.ttf",
        "italic": "Penna-Swashes.ttf",
        "bold_italic": "Penna-Swashes.ttf",
    },
    "Oleragie": {
        "regular": "Oleragie.otf",
        "bold": "Oleragie.otf",
        "italic": "Oleragie.otf",
        "bold_italic": "Oleragie.otf",
    },
    "Peristiwa": {
        "regular": "Peristiwa.otf",
        "bold": "Peristiwa.otf",
        "italic": "Peristiwa.otf",
        "bold_italic": "Peristiwa.otf",
    },
    "Signatie": {
        "regular": "Signatie.ttf",
        "bold": "Signatie.ttf",
        "italic": "Signatie.ttf",
        "bold_italic": "Signatie.ttf",
    },
    "D Signature": {
        "regular": "dsignature.ttf",
        "bold": "dsignature.ttf",
        "italic": "dsignature.ttf",
        "bold_italic": "dsignature.ttf",
    },
    "Black Signature": {
        "regular": "BlackSignature_PERSONAL_USE_ONLY.otf",
        "bold": "BlackSignature_PERSONAL_USE_ONLY.otf",
        "italic": "BlackSignature_PERSONAL_USE_ONLY.otf",
        "bold_italic": "BlackSignature_PERSONAL_USE_ONLY.otf",
    },
}


class RenderService:
    """
    Composites a saved CardCustomization's text boxes onto its card template.
    Font filenames are matched to the actual fonts(1).zip package.

    EDITOR_CANVAS_WIDTH / EDITOR_TEXT_MAX_WIDTH are defined as CLASS
    attributes (not module-level globals) so every calculation below
    (font scale, wrapping width, position) always uses the SAME numbers
    the live browser editor uses (450px canvas / 320px text box). This
    is what keeps the downloaded image matching what the user saw while
    customizing.
    """

    EDITOR_CANVAS_WIDTH = 450
    EDITOR_TEXT_MAX_WIDTH = 320

    @staticmethod
    def _font_path(font_family, bold=False, italic=False):
        variants = FONT_FILES.get(font_family, FONT_FILES["Poppins"])

        if bold and italic:
            filename = variants.get("bold_italic", variants["regular"])
        elif bold:
            filename = variants.get("bold", variants["regular"])
        elif italic:
            filename = variants.get("italic", variants["regular"])
        else:
            filename = variants["regular"]

        fonts_dir = os.path.join(current_app.root_path, "static", "fonts")
        path = os.path.join(fonts_dir, filename)

        if os.path.exists(path):
            return path

        current_app.logger.warning(
            f"[fonts] Missing font file '{filename}' for family "
            f"'{font_family}' (bold={bold}, italic={italic}) — "
            f"falling back to Poppins."
        )

        poppins = FONT_FILES["Poppins"]
        if bold and italic:
            fallback = poppins["bold_italic"]
        elif bold:
            fallback = poppins["bold"]
        elif italic:
            fallback = poppins["italic"]
        else:
            fallback = poppins["regular"]

        fallback_path = os.path.join(fonts_dir, fallback)
        return fallback_path if os.path.exists(fallback_path) else None

    @staticmethod
    def _load_font(font_family, bold=False, italic=False, size=16):
        path = RenderService._font_path(font_family, bold, italic)
        try:
            return (
                ImageFont.truetype(path, size)
                if path
                else ImageFont.load_default()
            )
        except Exception as exc:
            current_app.logger.warning(
                f"[fonts] Could not load '{path}' for '{font_family}': {exc}"
            )
            return ImageFont.load_default()

    @staticmethod
    def _text_width(draw, text, font, letter_spacing=0):
        width = draw.textlength(text, font=font)
        if letter_spacing and len(text) > 1:
            width += letter_spacing * (len(text) - 1)
        return width

    @staticmethod
    def _draw_line(draw, x, y, text, font, fill, letter_spacing=0):
        if not letter_spacing:
            draw.text((x, y), text, font=font, fill=fill)
            return draw.textlength(text, font=font)

        cursor = x
        for char in text:
            draw.text((cursor, y), char, font=font, fill=fill)
            cursor += draw.textlength(char, font=font) + letter_spacing

        return (cursor - letter_spacing) - x

    @staticmethod
    def _wrap_text(draw, text, font, max_width, letter_spacing=0):
        lines = []

        for raw_line in text.split("\n"):
            words = raw_line.split(" ")

            if not words:
                lines.append("")
                continue

            current = words[0]

            for word in words[1:]:
                candidate = f"{current} {word}"

                if RenderService._text_width(
                    draw, candidate, font, letter_spacing
                ) <= max_width:
                    current = candidate
                else:
                    lines.append(current)
                    current = word

            lines.append(current)

        return lines

    @staticmethod
    def _draw_text_on_frame(base, text_box):
        """Draw one text box onto an already-open Pillow image."""
        base = base.convert("RGBA")
        draw = ImageDraw.Draw(base)
        img_w, img_h = base.size

        # Read straight off the class — always defined, no NameError risk,
        # and guaranteed to match the editor's canvas/text-box dimensions.
        canvas_width = RenderService.EDITOR_CANVAS_WIDTH
        text_max_width = RenderService.EDITOR_TEXT_MAX_WIDTH

        scale = img_w / canvas_width
        scaled_font_size = max(
            1,
            round(text_box.font_size * scale),
        )

        font = RenderService._load_font(
            text_box.font_family,
            text_box.bold,
            text_box.italic,
            scaled_font_size,
        )

        text = text_box.content or ""

        if not text.strip():
            return base

        letter_spacing = (text_box.letter_spacing or 0) * scale
        max_width = text_max_width * scale

        lines = RenderService._wrap_text(
            draw,
            text,
            font,
            max_width,
            letter_spacing,
        )

        line_height = int(
            scaled_font_size * (text_box.line_height or 1.2)
        )
        total_height = line_height * len(lines)

        anchor_x = img_w * (text_box.position_x / 100)
        anchor_y = img_h * (text_box.position_y / 100)

        start_y = anchor_y - (total_height / 2)

        color = text_box.font_color or "#000000"
        alignment = text_box.alignment or "center"

        line_widths = [
            RenderService._text_width(
                draw,
                line,
                font,
                letter_spacing,
            )
            for line in lines
        ]

        box_w = max(line_widths) if line_widths else 0
        box_left = anchor_x - (box_w / 2)

        for i, line in enumerate(lines):
            line_w = line_widths[i]

            if alignment == "left":
                x = box_left
            elif alignment == "right":
                x = box_left + box_w - line_w
            else:
                x = box_left + (box_w - line_w) / 2

            y = start_y + i * line_height

            RenderService._draw_line(
                draw,
                x,
                y,
                line,
                font,
                color,
                letter_spacing,
            )

            if text_box.underline:
                bbox = draw.textbbox(
                    (0, 0),
                    line,
                    font=font,
                )
                underline_y = y + bbox[3] + 2

                draw.line(
                    [(x, underline_y), (x + line_w, underline_y)],
                    fill=color,
                    width=max(1, scaled_font_size // 20),
                )

        return base

    @staticmethod
    def render(template_path, customization):
        """Render all text boxes onto a static image."""
        from app.Card_Cutomization.services import CustomizationService

        base = Image.open(template_path).convert("RGBA")

        for box in CustomizationService._effective_boxes(customization):
            base = RenderService._draw_text_on_frame(base, box)

        return base

    @staticmethod
    def render_gif(gif_path, customization):
        """Render all text boxes onto every GIF frame."""
        from app.Card_Cutomization.services import CustomizationService

        boxes = CustomizationService._effective_boxes(customization)
        im = Image.open(gif_path)

        composited_frames = []
        durations = []

        for frame in ImageSequence.Iterator(im):
            composited = frame.copy().convert("RGBA")

            for box in boxes:
                composited = RenderService._draw_text_on_frame(
                    composited,
                    box,
                )

            composited_frames.append(
                composited.convert("P", palette=Image.ADAPTIVE)
            )
            durations.append(
                frame.info.get("duration", 100)
            )

        if not composited_frames:
            return b""

        buf = io.BytesIO()

        composited_frames[0].save(
            buf,
            format="GIF",
            save_all=True,
            append_images=composited_frames[1:],
            duration=durations,
            loop=im.info.get("loop", 0),
            disposal=2,
        )

        return buf.getvalue()

# import os
# import io
# from PIL import Image, ImageDraw, ImageFont, ImageSequence
# from flask import current_app


# # AUTO-GENERATED / VERIFIED AGAINST fonts(1).zip
# # Expected directory:
# #   app/static/fonts/
# #
# # IMPORTANT:
# # The filenames below use the exact case/spelling from the ZIP.
# # Where the ZIP does not contain a separate bold/italic variant,
# # the closest available font file is used.

# FONT_FILES = {
#     "SaolDisplay": {
#         "regular": "SaolDisplay-Regular.ttf",
#         "bold": "SaolDisplay-Regular.ttf",
#         "italic": "SaolDisplay-Regular.ttf",
#         "bold_italic": "SaolDisplay-Regular.ttf",
#     },
#     "NeueMontreal": {
#         "regular": "NeueMontreal-Regular.otf",
#         "bold": "NeueMontreal-Medium.otf",
#         "italic": "NeueMontreal-MediumItalic.otf",
#         "bold_italic": "NeueMontreal-Medium.otf",
#     },
#     "Playfair Display": {
#         "regular": "PlayfairDisplay-Regular.ttf",
#         "bold": "PlayfairDisplay-Regular.ttf",
#         "italic": "PlayfairDisplay-Italic.ttf",
#         "bold_italic": "PlayfairDisplay-Italic.ttf",
#     },
#     "Cinzel Decorative": {
#         "regular": "CinzelDecorative-Regular.otf",
#         "bold": "CinzelDecorative-Regular.otf",
#         "italic": "CinzelDecorative-Regular.otf",
#         "bold_italic": "CinzelDecorative-Regular.otf",
#     },
#     "Cormorant Garamond": {
#         "regular": "CormorantGaramond-Regular.ttf",
#         "bold": "CormorantGaramond-Medium.ttf",
#         "italic": "CormorantGaramond-Regular.ttf",
#         "bold_italic": "CormorantGaramond-Medium.ttf",
#     },
#     "Cormorant Infant": {
#         "regular": "CormorantInfant-SemiBold.ttf",
#         "bold": "CormorantInfant-SemiBold.ttf",
#         "italic": "CormorantInfant-SemiBold.ttf",
#         "bold_italic": "CormorantInfant-SemiBold.ttf",
#     },
#     "DM Serif Display": {
#         "regular": "DMSerifDisplay-Regular.ttf",
#         "bold": "DMSerifDisplay-Regular.ttf",
#         "italic": "DMSerifDisplay-Regular.ttf",
#         "bold_italic": "DMSerifDisplay-Regular.ttf",
#     },
#     "Gilda Display": {
#         "regular": "GildaDisplay-Regular.ttf",
#         "bold": "GildaDisplay-Regular.ttf",
#         "italic": "GildaDisplay-Regular.ttf",
#         "bold_italic": "GildaDisplay-Regular.ttf",
#     },
#     "Italiana": {
#         "regular": "Italiana-Regular.ttf",
#         "bold": "Italiana-Regular.ttf",
#         "italic": "Italiana-Regular.ttf",
#         "bold_italic": "Italiana-Regular.ttf",
#     },
#     "Libre Baskerville": {
#         "regular": "LibreBaskerville-Regular.ttf",
#         "bold": "LibreBaskerville-Medium.ttf",
#         "italic": "LibreBaskerville-Italic.ttf",
#         "bold_italic": "LibreBaskerville-Medium.ttf",
#     },
#     "Libre Caslon Display": {
#         "regular": "LibreCaslonDisplay-Regular.ttf",
#         "bold": "LibreCaslonDisplay-Regular.ttf",
#         "italic": "LibreCaslonDisplay-Regular.ttf",
#         "bold_italic": "LibreCaslonDisplay-Regular.ttf",
#     },
#     "Lora": {
#         "regular": "Lora-Regular.ttf",
#         "bold": "Lora-Regular.ttf",
#         "italic": "Lora-Regular.ttf",
#         "bold_italic": "Lora-Regular.ttf",
#     },
#     "Marcellus": {
#         "regular": "Marcellus-Regular.ttf",
#         "bold": "Marcellus-Regular.ttf",
#         "italic": "Marcellus-Regular.ttf",
#         "bold_italic": "Marcellus-Regular.ttf",
#     },
#     "Newsreader": {
#         "regular": "Newsreader_24pt-Regular.ttf",
#         "bold": "Newsreader_24pt-Regular.ttf",
#         "italic": "Newsreader_24pt-Regular.ttf",
#         "bold_italic": "Newsreader_24pt-Regular.ttf",
#     },
#     "Prata": {
#         "regular": "Prata-Regular.ttf",
#         "bold": "Prata-Regular.ttf",
#         "italic": "Prata-Regular.ttf",
#         "bold_italic": "Prata-Regular.ttf",
#     },
#     "Vidaloka": {
#         "regular": "Vidaloka-Regular.ttf",
#         "bold": "Vidaloka-Regular.ttf",
#         "italic": "Vidaloka-Regular.ttf",
#         "bold_italic": "Vidaloka-Regular.ttf",
#     },
#     "Times New Roman": {
#         "regular": "times.ttf",
#         "bold": "times.ttf",
#         "italic": "timesi.ttf",
#         "bold_italic": "timesi.ttf",
#     },
#     "Poppins": {
#         "regular": "Poppins-Regular.otf",
#         "bold": "Poppins-Bold.ttf",
#         "italic": "Poppins-Italic.ttf",
#         "bold_italic": "Poppins-BoldItalic.ttf",
#     },
#     "Montserrat": {
#         "regular": "Montserrat-Regular.ttf",
#         "bold": "Montserrat-Medium.ttf",
#         "italic": "Montserrat-Regular.ttf",
#         "bold_italic": "Montserrat-Medium.ttf",
#     },
#     "Open Sans": {
#         "regular": "OpenSans-Regular.ttf",
#         "bold": "OpenSans-Regular.ttf",
#         "italic": "OpenSans-Regular.ttf",
#         "bold_italic": "OpenSans-Regular.ttf",
#     },
#     "DM Sans": {
#         "regular": "DMSans_36pt-Regular.ttf",
#         "bold": "DMSans_36pt-Regular.ttf",
#         "italic": "DMSans_36pt-Regular.ttf",
#         "bold_italic": "DMSans_36pt-Regular.ttf",
#     },
#     "Work Sans": {
#         "regular": "WorkSans-Medium.ttf",
#         "bold": "WorkSans-Medium.ttf",
#         "italic": "WorkSans-Medium.ttf",
#         "bold_italic": "WorkSans-Medium.ttf",
#     },
#     "Raleway": {
#         "regular": "Raleway Medium.ttf",
#         "bold": "Raleway Medium.ttf",
#         "italic": "Raleway Medium.ttf",
#         "bold_italic": "Raleway Medium.ttf",
#     },
#     "Questrial": {
#         "regular": "Questrial-Regular.ttf",
#         "bold": "Questrial-Regular.ttf",
#         "italic": "Questrial-Regular.ttf",
#         "bold_italic": "Questrial-Regular.ttf",
#     },
#     "Oswald": {
#         "regular": "Oswald-Light.ttf",
#         "bold": "Oswald-Medium.ttf",
#         "italic": "Oswald-Light.ttf",
#         "bold_italic": "Oswald-Medium.ttf",
#     },
#     "Comfortaa": {
#         "regular": "Comfortaa-Regular.ttf",
#         "bold": "Comfortaa-Bold.ttf",
#         "italic": "Comfortaa-Regular.ttf",
#         "bold_italic": "Comfortaa-Bold.ttf",
#     },
#     "Comic Neue": {
#         "regular": "ComicNeue-Angular-Regular.ttf",
#         "bold": "ComicNeue-Angular-Bold.ttf",
#         "italic": "ComicNeue-Angular-Regular.ttf",
#         "bold_italic": "ComicNeue-Angular-Bold.ttf",
#     },
#     "Grandstander": {
#         "regular": "Grandstander-Medium.ttf",
#         "bold": "Grandstander-Medium.ttf",
#         "italic": "Grandstander-Medium.ttf",
#         "bold_italic": "Grandstander-Medium.ttf",
#     },
#     "Switzerland": {
#         "regular": "Switzerland.ttf",
#         "bold": "Switzerland.ttf",
#         "italic": "Switzerland.ttf",
#         "bold_italic": "Switzerland.ttf",
#     },
#     "Helvetica": {
#         "regular": "Helvetica.ttf",
#         "bold": "Helvetica-Bold-Font.ttf",
#         "italic": "Helvetica.ttf",
#         "bold_italic": "Helvetica-Bold-Font.ttf",
#     },
#     "Caveat": {
#         "regular": "Caveat-Regular.ttf",
#         "bold": "Caveat-Regular.ttf",
#         "italic": "Caveat-Regular.ttf",
#         "bold_italic": "Caveat-Regular.ttf",
#     },
#     "Kalam": {
#         "regular": "Kalam-Regular.ttf",
#         "bold": "Kalam-Regular.ttf",
#         "italic": "Kalam-Regular.ttf",
#         "bold_italic": "Kalam-Regular.ttf",
#     },
#     "Patrick Hand": {
#         "regular": "PatrickHand-Regular.ttf",
#         "bold": "PatrickHand-Regular.ttf",
#         "italic": "PatrickHand-Regular.ttf",
#         "bold_italic": "PatrickHand-Regular.ttf",
#     },
#     "Amatic SC": {
#         "regular": "AmaticSC-Bold.ttf",
#         "bold": "AmaticSC-Bold.ttf",
#         "italic": "AmaticSC-Bold.ttf",
#         "bold_italic": "AmaticSC-Bold.ttf",
#     },
#     "Alex Brush": {
#         "regular": "AlexBrush-Regular.ttf",
#         "bold": "AlexBrush-Regular.ttf",
#         "italic": "AlexBrush-Regular.ttf",
#         "bold_italic": "AlexBrush-Regular.ttf",
#     },
#     "Great Vibes": {
#         "regular": "GreatVibes-Regular.ttf",
#         "bold": "GreatVibes-Regular.ttf",
#         "italic": "GreatVibes-Regular.ttf",
#         "bold_italic": "GreatVibes-Regular.ttf",
#     },
#     "Dancing Script": {
#         "regular": "Dancing Script.ttf",
#         "bold": "Dancing Script.ttf",
#         "italic": "Dancing Script.ttf",
#         "bold_italic": "Dancing Script.ttf",
#     },
#     "Parisienne": {
#         "regular": "Parisienne-Regular.ttf",
#         "bold": "Parisienne-Regular.ttf",
#         "italic": "Parisienne-Regular.ttf",
#         "bold_italic": "Parisienne-Regular.ttf",
#     },
#     "Pinyon Script": {
#         "regular": "PinyonScript-Regular.ttf",
#         "bold": "PinyonScript-Regular.ttf",
#         "italic": "PinyonScript-Regular.ttf",
#         "bold_italic": "PinyonScript-Regular.ttf",
#     },
#     "Satisfy": {
#         "regular": "Satisfy-Regular.ttf",
#         "bold": "Satisfy-Regular.ttf",
#         "italic": "Satisfy-Regular.ttf",
#         "bold_italic": "Satisfy-Regular.ttf",
#     },
#     "Yellowtail": {
#         "regular": "Yellowtail-Regular.ttf",
#         "bold": "Yellowtail-Regular.ttf",
#         "italic": "Yellowtail-Regular.ttf",
#         "bold_italic": "Yellowtail-Regular.ttf",
#     },
#     "Pacifico": {
#         "regular": "Pacifico.ttf",
#         "bold": "Pacifico.ttf",
#         "italic": "Pacifico.ttf",
#         "bold_italic": "Pacifico.ttf",
#     },
#     "Lobster": {
#         "regular": "Lobster.otf",
#         "bold": "Lobster.otf",
#         "italic": "Lobster.otf",
#         "bold_italic": "Lobster.otf",
#     },
#     "Bright Mirage": {
#         "regular": "BrightMirage-R91Ve.ttf",
#         "bold": "BrightMirage-R91Ve.ttf",
#         "italic": "BrightMirage-R91Ve.ttf",
#         "bold_italic": "BrightMirage-R91Ve.ttf",
#     },
#     "Brittany Signature": {
#         "regular": "BrittanySignature.ttf",
#         "bold": "BrittanySignature.ttf",
#         "italic": "BrittanySignature.ttf",
#         "bold_italic": "BrittanySignature.ttf",
#     },
#     "Brush Signature": {
#         "regular": "Brush Signature.ttf",
#         "bold": "Brush Signature.ttf",
#         "italic": "Brush Signature.ttf",
#         "bold_italic": "Brush Signature.ttf",
#     },
#     "Creative Signature": {
#         "regular": "CreativeSignature.ttf",
#         "bold": "CreativeSignature.ttf",
#         "italic": "CreativeSignature.ttf",
#         "bold_italic": "CreativeSignature.ttf",
#     },
#     "Geraldyne Signature": {
#         "regular": "GeraldyneSignature-RpzpW.ttf",
#         "bold": "GeraldyneSignature-RpzpW.ttf",
#         "italic": "GeraldyneSignature-RpzpW.ttf",
#         "bold_italic": "GeraldyneSignature-RpzpW.ttf",
#     },
#     "Mitogen Signature": {
#         "regular": "Mitogen Signature.ttf",
#         "bold": "Mitogen Signature.ttf",
#         "italic": "Mitogen Signature.ttf",
#         "bold_italic": "Mitogen Signature.ttf",
#     },
#     "Paul Signature": {
#         "regular": "Paul Signature.ttf",
#         "bold": "Paul Signature.ttf",
#         "italic": "Paul Signature.ttf",
#         "bold_italic": "Paul Signature.ttf",
#     },
#     "Yustine Signature": {
#         "regular": "Yustine Signature.ttf",
#         "bold": "Yustine Signature.ttf",
#         "italic": "Yustine Signature.ttf",
#         "bold_italic": "Yustine Signature.ttf",
#     },
#     "Penna Swashes": {
#         "regular": "Penna-Swashes.ttf",
#         "bold": "Penna-Swashes.ttf",
#         "italic": "Penna-Swashes.ttf",
#         "bold_italic": "Penna-Swashes.ttf",
#     },
#     "Oleragie": {
#         "regular": "Oleragie.otf",
#         "bold": "Oleragie.otf",
#         "italic": "Oleragie.otf",
#         "bold_italic": "Oleragie.otf",
#     },
#     "Peristiwa": {
#         "regular": "Peristiwa.otf",
#         "bold": "Peristiwa.otf",
#         "italic": "Peristiwa.otf",
#         "bold_italic": "Peristiwa.otf",
#     },
#     "Signatie": {
#         "regular": "Signatie.ttf",
#         "bold": "Signatie.ttf",
#         "italic": "Signatie.ttf",
#         "bold_italic": "Signatie.ttf",
#     },
#     "D Signature": {
#         "regular": "dsignature.ttf",
#         "bold": "dsignature.ttf",
#         "italic": "dsignature.ttf",
#         "bold_italic": "dsignature.ttf",
#     },
#     "Black Signature": {
#         "regular": "BlackSignature_PERSONAL_USE_ONLY.otf",
#         "bold": "BlackSignature_PERSONAL_USE_ONLY.otf",
#         "italic": "BlackSignature_PERSONAL_USE_ONLY.otf",
#         "bold_italic": "BlackSignature_PERSONAL_USE_ONLY.otf",
#     },
# }


# EDITOR_CANVAS_WIDTH = 450
# EDITOR_TEXT_MAX_WIDTH = 320


# class RenderService:
#     """
#     Composites a saved CardCustomization's text boxes onto its card template.
#     Font filenames are matched to the actual fonts(1).zip package.
#     """

#     @staticmethod
#     def _font_path(font_family, bold=False, italic=False):
#         variants = FONT_FILES.get(font_family, FONT_FILES["Poppins"])

#         if bold and italic:
#             filename = variants.get("bold_italic", variants["regular"])
#         elif bold:
#             filename = variants.get("bold", variants["regular"])
#         elif italic:
#             filename = variants.get("italic", variants["regular"])
#         else:
#             filename = variants["regular"]

#         fonts_dir = os.path.join(current_app.root_path, "static", "fonts")
#         path = os.path.join(fonts_dir, filename)

#         if os.path.exists(path):
#             return path

#         current_app.logger.warning(
#             f"[fonts] Missing font file '{filename}' for family "
#             f"'{font_family}' (bold={bold}, italic={italic}) — "
#             f"falling back to Poppins."
#         )

#         poppins = FONT_FILES["Poppins"]
#         if bold and italic:
#             fallback = poppins["bold_italic"]
#         elif bold:
#             fallback = poppins["bold"]
#         elif italic:
#             fallback = poppins["italic"]
#         else:
#             fallback = poppins["regular"]

#         fallback_path = os.path.join(fonts_dir, fallback)
#         return fallback_path if os.path.exists(fallback_path) else None

#     @staticmethod
#     def _load_font(font_family, bold=False, italic=False, size=16):
#         path = RenderService._font_path(font_family, bold, italic)
#         try:
#             return (
#                 ImageFont.truetype(path, size)
#                 if path
#                 else ImageFont.load_default()
#             )
#         except Exception as exc:
#             current_app.logger.warning(
#                 f"[fonts] Could not load '{path}' for '{font_family}': {exc}"
#             )
#             return ImageFont.load_default()

#     @staticmethod
#     def _text_width(draw, text, font, letter_spacing=0):
#         width = draw.textlength(text, font=font)
#         if letter_spacing and len(text) > 1:
#             width += letter_spacing * (len(text) - 1)
#         return width

#     @staticmethod
#     def _draw_line(draw, x, y, text, font, fill, letter_spacing=0):
#         if not letter_spacing:
#             draw.text((x, y), text, font=font, fill=fill)
#             return draw.textlength(text, font=font)

#         cursor = x
#         for char in text:
#             draw.text((cursor, y), char, font=font, fill=fill)
#             cursor += draw.textlength(char, font=font) + letter_spacing

#         return (cursor - letter_spacing) - x

#     @staticmethod
#     def _wrap_text(draw, text, font, max_width, letter_spacing=0):
#         lines = []

#         for raw_line in text.split("\n"):
#             words = raw_line.split(" ")

#             if not words:
#                 lines.append("")
#                 continue

#             current = words[0]

#             for word in words[1:]:
#                 candidate = f"{current} {word}"

#                 if RenderService._text_width(
#                     draw, candidate, font, letter_spacing
#                 ) <= max_width:
#                     current = candidate
#                 else:
#                     lines.append(current)
#                     current = word

#             lines.append(current)

#         return lines

#     @staticmethod
#     def _draw_text_on_frame(base, text_box):
#         """Draw one text box onto an already-open Pillow image."""
#         base = base.convert("RGBA")
#         draw = ImageDraw.Draw(base)
#         img_w, img_h = base.size

#         canvas_width = getattr(
#             RenderService,
#             "EDITOR_CANVAS_WIDTH",
#             EDITOR_CANVAS_WIDTH,
#         )
#         text_max_width = getattr(
#             RenderService,
#             "EDITOR_TEXT_MAX_WIDTH",
#             EDITOR_TEXT_MAX_WIDTH,
#         )

#         scale = img_w / canvas_width
#         scaled_font_size = max(
#             1,
#             round(text_box.font_size * scale),
#         )

#         font = RenderService._load_font(
#             text_box.font_family,
#             text_box.bold,
#             text_box.italic,
#             scaled_font_size,
#         )

#         text = text_box.content or ""

#         if not text.strip():
#             return base

#         letter_spacing = (text_box.letter_spacing or 0) * scale
#         max_width = text_max_width * scale

#         lines = RenderService._wrap_text(
#             draw,
#             text,
#             font,
#             max_width,
#             letter_spacing,
#         )

#         line_height = int(
#             scaled_font_size * (text_box.line_height or 1.2)
#         )
#         total_height = line_height * len(lines)

#         anchor_x = img_w * (text_box.position_x / 100)
#         anchor_y = img_h * (text_box.position_y / 100)

#         start_y = anchor_y - (total_height / 2)

#         color = text_box.font_color or "#000000"
#         alignment = text_box.alignment or "center"

#         line_widths = [
#             RenderService._text_width(
#                 draw,
#                 line,
#                 font,
#                 letter_spacing,
#             )
#             for line in lines
#         ]

#         box_w = max(line_widths) if line_widths else 0
#         box_left = anchor_x - (box_w / 2)

#         for i, line in enumerate(lines):
#             line_w = line_widths[i]

#             if alignment == "left":
#                 x = box_left
#             elif alignment == "right":
#                 x = box_left + box_w - line_w
#             else:
#                 x = box_left + (box_w - line_w) / 2

#             y = start_y + i * line_height

#             RenderService._draw_line(
#                 draw,
#                 x,
#                 y,
#                 line,
#                 font,
#                 color,
#                 letter_spacing,
#             )

#             if text_box.underline:
#                 bbox = draw.textbbox(
#                     (0, 0),
#                     line,
#                     font=font,
#                 )
#                 underline_y = y + bbox[3] + 2

#                 draw.line(
#                     [(x, underline_y), (x + line_w, underline_y)],
#                     fill=color,
#                     width=max(1, scaled_font_size // 20),
#                 )

#         return base

#     @staticmethod
#     def render(template_path, customization):
#         """Render all text boxes onto a static image."""
#         from app.Card_Cutomization.services import CustomizationService

#         base = Image.open(template_path).convert("RGBA")

#         for box in CustomizationService._effective_boxes(customization):
#             base = RenderService._draw_text_on_frame(base, box)

#         return base

#     @staticmethod
#     def render_gif(gif_path, customization):
#         """Render all text boxes onto every GIF frame."""
#         from app.Card_Cutomization.services import CustomizationService

#         boxes = CustomizationService._effective_boxes(customization)
#         im = Image.open(gif_path)

#         composited_frames = []
#         durations = []

#         for frame in ImageSequence.Iterator(im):
#             composited = frame.copy().convert("RGBA")

#             for box in boxes:
#                 composited = RenderService._draw_text_on_frame(
#                     composited,
#                     box,
#                 )

#             composited_frames.append(
#                 composited.convert("P", palette=Image.ADAPTIVE)
#             )
#             durations.append(
#                 frame.info.get("duration", 100)
#             )

#         if not composited_frames:
#             return b""

#         buf = io.BytesIO()

#         composited_frames[0].save(
#             buf,
#             format="GIF",
#             save_all=True,
#             append_images=composited_frames[1:],
#             duration=durations,
#             loop=im.info.get("loop", 0),
#             disposal=2,
#         )

#         return buf.getvalue()



# import os
# import textwrap
# from PIL import Image, ImageDraw, ImageFont, ImageSequence
# import io
# from flask import current_app


# FONT_FILES = {
#     "Poppins": {"regular": "Poppins-Regular.otf"},
#     "Montserrat": {"regular": "Montserrat-Regular.ttf", "bold": "Montserrat-Medium.ttf"},
#     "Playfair Display": {"regular": "PlayfairDisplay-Regular.ttf", "italic": "PlayfairDisplay-Italic.ttf"},
#     "Open Sans": {"regular": "OpenSans-Regular.ttf"},
#     "Oswald": {"regular": "Oswald-Light.ttf", "bold": "Oswald-Medium.ttf"},
#     "Pacifico": {"regular": "Pacifico.ttf"},
#     "Parisienne": {"regular": "Parisienne-Regular.ttf"},
#     "Patrick Hand": {"regular": "PatrickHand-Regular.ttf"},
#     "Pinyon Script": {"regular": "PinyonScript-Regular.ttf"},
#     "Prata": {"regular": "Prata-Regular.ttf"},
#     "Questrial": {"regular": "Questrial-Regular.ttf"},
#     "Raleway": {"regular": "Raleway Medium.ttf"},
#     "Satisfy": {"regular": "Satisfy-Regular.ttf"},
#     "Vidaloka": {"regular": "Vidaloka-Regular.ttf"},
#     "Work Sans": {"regular": "WorkSans-Medium.ttf"},
#     "Yellowtail": {"regular": "Yellowtail-Regular.ttf"},
#     "Alex Brush": {"regular": "AlexBrush-Regular.ttf"},
#     "Amatic SC": {"regular": "AmaticSC-Bold.ttf"},
#     "Caveat": {"regular": "Caveat-Regular.ttf"},
#     "Cinzel Decorative": {"regular": "CinzelDecorative-Regular.otf"},
#     "Comfortaa": {"regular": "Comfortaa-Regular.ttf", "bold": "Comfortaa-Bold.ttf"},
#     "Comic Neue": {"regular": "ComicNeue-Angular-Regular.ttf", "bold": "ComicNeue-Angular-Bold.ttf"},
#     "Cormorant Garamond": {"regular": "CormorantGaramond-Regular.ttf", "bold": "CormorantGaramond-Medium.ttf"},
#     "Cormorant Infant": {"regular": "CormorantInfant-SemiBold.ttf"},
#     "DM Sans": {"regular": "DMSans_36pt-Regular.ttf"},
#     "DM Serif Display": {"regular": "DMSerifDisplay-Regular.ttf"},
#     "Dancing Script": {"regular": "Dancing Script.ttf"},
#     "Gilda Display": {"regular": "GildaDisplay-Regular.ttf"},
#     "Grandstander": {"regular": "Grandstander-Medium.ttf"},
#     "Great Vibes": {"regular": "GreatVibes-Regular.ttf"},
#     "Helvetica": {"regular": "Helvetica.ttf", "bold": "Helvetica-Bold-Font.ttf"},
#     "Italiana": {"regular": "Italiana-Regular.ttf"},
#     "Kalam": {"regular": "Kalam-Regular.ttf"},
#     "Libre Baskerville": {"regular": "LibreBaskerville-Regular.ttf", "bold": "LibreBaskerville-Medium.ttf", "italic": "LibreBaskerville-Italic.ttf"},
#     "Libre Caslon Display": {"regular": "LibreCaslonDisplay-Regular.ttf"},
#     "Lobster": {"regular": "Lobster.otf"},
#     "Lora": {"regular": "Lora-Regular.ttf"},
#     "Marcellus": {"regular": "Marcellus-Regular.ttf"},
#     "Newsreader": {"regular": "Newsreader_24pt-Regular.ttf"},
#     "Oleragie": {"regular": "Oleragie.otf"},
#     "Peristiwa": {"regular": "Peristiwa.otf"},
#     "Penna Swashes": {"regular": "Penna-Swashes.ttf"},
#     "Switzerland": {"regular": "Switzerland.ttf"},
#     "Times New Roman": {"regular": "times.ttf", "italic": "timesi.ttf"},
#     "Mitogen Signature": {"regular": "Mitogen Signature.ttf"},
#     "Paul Signature": {"regular": "Paul Signature.ttf"},
#     "Yustine Signature": {"regular": "Yustine Signature.ttf"},
#     "Brittany Signature": {"regular": "BrittanySignature.ttf"},
#     "Brush Signature": {"regular": "Brush Signature.ttf"},
#     "Creative Signature": {"regular": "CreativeSignature.ttf"},
#     "Geraldyne Signature": {"regular": "GeraldyneSignature-RpzpW.ttf"},
#     "Signatie": {"regular": "Signatie.ttf"},
#     "D Signature": {"regular": "dsignature.ttf"},
#     "Bright Mirage": {"regular": "BrightMirage-R91Ve.ttf"},
#     "Black Signature": {"regular": "BlackSignature_PERSONAL_USE_ONLY.otf"},  # flagged above — confirm license before commercial use
# }

# EDITOR_CANVAS_WIDTH = 450
# EDITOR_TEXT_MAX_WIDTH = 320


# class RenderService:
#     """
#     Composites a saved CardCustomization's text boxes onto its card's
#     template image, so downloads reflect what the user actually designed.
#     """

#     @staticmethod
#     def _font_path(font_family, bold, italic):
#         variants = FONT_FILES.get(font_family, FONT_FILES["Poppins"])
#         if bold and italic and "bold_italic" in variants:
#             filename = variants["bold_italic"]
#         elif bold and "bold" in variants:
#             filename = variants["bold"]
#         elif italic and "italic" in variants:
#             filename = variants["italic"]
#         else:
#             filename = variants["regular"]
#         path = os.path.join(current_app.root_path, "static", "fonts", filename)
#         return path if os.path.exists(path) else None

#     @staticmethod
#     def _load_font(font_family, bold=False, italic=False, size=16):
#         # BUG FIX: this used to call _font_path(font_family, italic, bold) —
#         # italic and bold were swapped, so requesting bold gave you italic
#         # (and vice versa) in every download.
#         path = RenderService._font_path(font_family, bold, italic)
#         try:
#             return ImageFont.truetype(path, size) if path else ImageFont.load_default()
#         except Exception:
#             return ImageFont.load_default()

#     @staticmethod
#     def _text_width(draw, text, font, letter_spacing=0):
#         width = draw.textlength(text, font=font)
#         if letter_spacing and len(text) > 1:
#             width += letter_spacing * (len(text) - 1)
#         return width

#     @staticmethod
#     def _draw_line(draw, x, y, text, font, fill, letter_spacing=0):
#         if not letter_spacing:
#             draw.text((x, y), text, font=font, fill=fill)
#             return draw.textlength(text, font=font)
#         cursor = x
#         for char in text:
#             draw.text((cursor, y), char, font=font, fill=fill)
#             cursor += draw.textlength(char, font=font) + letter_spacing
#         return (cursor - letter_spacing) - x

#     @staticmethod
#     def _wrap_text(draw, text, font, max_width, letter_spacing=0):
#         lines = []
#         for raw_line in text.split("\n"):
#             words = raw_line.split(" ")
#             if not words:
#                 lines.append("")
#                 continue
#             current = words[0]
#             for word in words[1:]:
#                 candidate = f"{current} {word}"
#                 if RenderService._text_width(draw, candidate, font, letter_spacing) <= max_width:
#                     current = candidate
#                 else:
#                     lines.append(current)
#                     current = word
#             lines.append(current)
#         return lines

#     @staticmethod
#     def _draw_text_on_frame(base, text_box):
#         """Composites ONE text box onto an already-open Pillow image (a
#         single frame). Called once per box in `render`/`render_gif`."""
#         base = base.convert("RGBA")
#         draw = ImageDraw.Draw(base)
#         img_w, img_h = base.size

#         canvas_width = getattr(RenderService, "EDITOR_CANVAS_WIDTH", EDITOR_CANVAS_WIDTH)
#         text_max_width = getattr(RenderService, "EDITOR_TEXT_MAX_WIDTH", EDITOR_TEXT_MAX_WIDTH)

#         scale = img_w / canvas_width
#         scaled_font_size = max(1, round(text_box.font_size * scale))
#         font = RenderService._load_font(text_box.font_family, text_box.bold, text_box.italic, scaled_font_size)

#         text = text_box.content or ""
#         if not text.strip():
#             return base

#         letter_spacing = (text_box.letter_spacing or 0) * scale
#         max_width = text_max_width * scale
#         lines = RenderService._wrap_text(draw, text, font, max_width, letter_spacing)

#         line_height = int(scaled_font_size * (text_box.line_height or 1.2))
#         total_height = line_height * len(lines)

#         anchor_x = img_w * (text_box.position_x / 100)
#         anchor_y = img_h * (text_box.position_y / 100)
#         start_y = anchor_y - (total_height / 2)
#         color = text_box.font_color or "#000000"
#         alignment = text_box.alignment or "center"

#         # BUG FIX: left/right alignment used to offset by an arbitrary
#         # img_w * 0.4 with no relation to the editor. The browser positions
#         # text inside a shrink-to-fit box (max-width EDITOR_TEXT_MAX_WIDTH)
#         # centred on the anchor point, and alignment only moves lines WITHIN
#         # that box — so we measure the box from the widest wrapped line,
#         # centre it on the anchor, then align inside it, matching the editor.
#         line_widths = [RenderService._text_width(draw, line, font, letter_spacing) for line in lines]
#         box_w = max(line_widths) if line_widths else 0
#         box_left = anchor_x - (box_w / 2)

#         for i, line in enumerate(lines):
#             line_w = line_widths[i]
#             if alignment == "left":
#                 x = box_left
#             elif alignment == "right":
#                 x = box_left + box_w - line_w
#             else:
#                 x = box_left + (box_w - line_w) / 2
#             y = start_y + i * line_height
#             RenderService._draw_line(draw, x, y, line, font, color, letter_spacing)
#             if text_box.underline:
#                 bbox = draw.textbbox((0, 0), line, font=font)
#                 underline_y = y + bbox[3] + 2
#                 draw.line([(x, underline_y), (x + line_w, underline_y)], fill=color, width=max(1, scaled_font_size // 20))

#         return base

#     @staticmethod
#     def render(template_path, customization):
#         """Static image path — used by 'image' and 'pdf' downloads. Draws
#         EVERY text box the user added, not just the first one."""
#         from app.Card_Cutomization.services import CustomizationService
#         base = Image.open(template_path).convert("RGBA")
#         for box in CustomizationService._effective_boxes(customization):
#             base = RenderService._draw_text_on_frame(base, box)
#         return base

#     @staticmethod
#     def render_gif(gif_path, customization):
#         """Animated path — draws every text box onto every frame, preserving
#         timing and loop."""
#         from app.Card_Cutomization.services import CustomizationService
#         boxes = CustomizationService._effective_boxes(customization)
#         im = Image.open(gif_path)
#         composited_frames, durations = [], []
#         for frame in ImageSequence.Iterator(im):
#             composited = frame.copy().convert("RGBA")
#             for box in boxes:
#                 composited = RenderService._draw_text_on_frame(composited, box)
#             composited_frames.append(composited.convert("P", palette=Image.ADAPTIVE))
#             durations.append(frame.info.get("duration", 100))
#         buf = io.BytesIO()
#         composited_frames[0].save(
#             buf, format="GIF", save_all=True, append_images=composited_frames[1:],
#             duration=durations, loop=im.info.get("loop", 0), disposal=2,
#         )
#         return buf.getvalue()
