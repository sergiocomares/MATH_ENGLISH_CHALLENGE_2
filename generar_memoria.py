from pathlib import Path

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "Memoria_MATH_CHALLENGE_1_SA1.pdf"
CAPTURES = ROOT / "assets" / "capturas"

NAVY = colors.HexColor("#17324D")
BLUE = colors.HexColor("#1F6FAE")
TEAL = colors.HexColor("#137D7A")
GOLD = colors.HexColor("#D7A533")
PALE_BLUE = colors.HexColor("#EAF3F8")
PALE_TEAL = colors.HexColor("#E7F4F2")
GREY = colors.HexColor("#5E6974")
LIGHT_GREY = colors.HexColor("#DCE4E9")


def register_fonts():
    font_dir = Path(r"C:\Windows\Fonts")
    pdfmetrics.registerFont(TTFont("Segoe", str(font_dir / "segoeui.ttf")))
    pdfmetrics.registerFont(TTFont("SegoeBold", str(font_dir / "segoeuib.ttf")))


def styles():
    base = getSampleStyleSheet()
    base.add(ParagraphStyle(
        name="Body", parent=base["BodyText"], fontName="Segoe", fontSize=9.3,
        leading=13.2, textColor=NAVY, spaceAfter=7,
    ))
    base.add(ParagraphStyle(
        name="Small", parent=base["BodyText"], fontName="Segoe", fontSize=7.3,
        leading=9.2, textColor=GREY,
    ))
    base.add(ParagraphStyle(
        name="CoverTitle", parent=base["Title"], fontName="SegoeBold", fontSize=27,
        leading=32, textColor=NAVY, alignment=TA_CENTER, spaceAfter=10,
    ))
    base.add(ParagraphStyle(
        name="Subtitle", parent=base["BodyText"], fontName="Segoe", fontSize=13,
        leading=18, textColor=BLUE, alignment=TA_CENTER,
    ))
    base.add(ParagraphStyle(
        name="H1", parent=base["Heading1"], fontName="SegoeBold", fontSize=18,
        leading=22, textColor=NAVY, spaceBefore=0, spaceAfter=10,
    ))
    base.add(ParagraphStyle(
        name="H2", parent=base["Heading2"], fontName="SegoeBold", fontSize=11.5,
        leading=15, textColor=TEAL, spaceBefore=8, spaceAfter=5,
    ))
    base.add(ParagraphStyle(
        name="Callout", parent=base["BodyText"], fontName="Segoe", fontSize=10,
        leading=14, textColor=NAVY, backColor=PALE_TEAL, borderColor=TEAL,
        borderWidth=0.5, borderPadding=9, spaceAfter=9,
    ))
    base.add(ParagraphStyle(
        name="Caption", parent=base["BodyText"], fontName="Segoe", fontSize=7.1,
        leading=8.8, textColor=GREY, alignment=TA_LEFT, spaceBefore=2,
    ))
    return base


def P(text, style="Body"):
    return Paragraph(text, STYLES[style])


def bullet(text):
    return P(f'<font color="#137D7A">●</font> {text}')


def section_title(number, title):
    return [
        P(f'<font color="#D7A533">{number:02d}</font>  {title}', "H1"),
        Spacer(1, 2),
    ]


def image_with_caption(filename, caption, width=7.7 * cm, height=6.15 * cm):
    path = CAPTURES / filename
    pixel_width, pixel_height = PILImage.open(path).size
    scale = min(width / pixel_width, height / pixel_height)
    image = Image(str(path), width=pixel_width * scale, height=pixel_height * scale)
    return [image, P(caption, "Caption")]


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LIGHT_GREY)
    canvas.setLineWidth(0.5)
    canvas.line(doc.leftMargin, 1.25 * cm, A4[0] - doc.rightMargin, 1.25 * cm)
    canvas.setFont("Segoe", 7.5)
    canvas.setFillColor(GREY)
    canvas.drawString(doc.leftMargin, 0.82 * cm, "IES Marqués de Comares · Matemáticas bilingües · MATH CHALLENGE 1 – SA1")
    canvas.drawRightString(A4[0] - doc.rightMargin, 0.82 * cm, f"Página {doc.page}")
    canvas.restoreState()


def build():
    register_fonts()
    global STYLES
    STYLES = styles()
    doc = BaseDocTemplate(
        str(OUTPUT), pagesize=A4, leftMargin=1.65 * cm, rightMargin=1.65 * cm,
        topMargin=1.55 * cm, bottomMargin=1.6 * cm,
    )
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="body")
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=footer)])
    story = []

    # 1. Cover
    story += [Spacer(1, 2.1 * cm), P("MEMORIA BREVE DE ACTIVIDAD BILINGÜE", "Subtitle"),
              Spacer(1, 0.35 * cm), P("MATH <font color='#1F6FAE'>CHALLENGE 1</font>", "CoverTitle"),
              P("SA1: Back to Class", "Subtitle"), Spacer(1, 1.0 * cm)]
    cover_box = Table([
        [P("<b>Centro</b><br/>IES Marqués de Comares", "Body"),
         P("<b>Etapa y materia</b><br/>2.º de ESO · Matemáticas bilingües", "Body")],
        [P("<b>Situación de aprendizaje</b><br/>SA1 – Back to Class", "Body"),
         P("<b>Carácter</b><br/>Práctica obligatoria y consolidación de vocabulario", "Body")],
    ], colWidths=[8.25 * cm, 8.25 * cm])
    cover_box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PALE_BLUE), ("BOX", (0, 0), (-1, -1), 0.5, LIGHT_GREY),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.white), ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 12), ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 11), ("BOTTOMPADDING", (0, 0), (-1, -1), 11),
    ]))
    story += [cover_box, Spacer(1, 1.15 * cm),
              P("Actividad digital de práctica del lenguaje matemático en inglés, planteada como reto lúdico y repetible.", "Callout"),
              Spacer(1, 0.5 * cm),
              P('<b>Accesos a la actividad por profesorado creador</b>', "Small"),
              P('<link href="https://sergiocomares.github.io/MATH_ENGLISH_CHALLENGE_1/?profe=sergiojodral" color="#1F6FAE">Sergio Jodral Estepa: sergiocomares.github.io/MATH_ENGLISH_CHALLENGE_1/?profe=sergiojodral</link>', "Small"),
              P('<link href="https://sergiocomares.github.io/MATH_ENGLISH_CHALLENGE_1/?profe=israeladamuz" color="#1F6FAE">Israel Adamuz Almirón: sergiocomares.github.io/MATH_ENGLISH_CHALLENGE_1/?profe=israeladamuz</link>', "Small"),
              Spacer(1, 2.5 * cm), P("Documento de presentación para la coordinación bilingüe", "Subtitle"),
              PageBreak()]

    # 2. Presentation
    story += section_title(1, "Presentación y justificación didáctica")
    story += [
        P("MATH CHALLENGE 1 – SA1: <i>Back to Class</i> es una actividad digital obligatoria de práctica y consolidación del vocabulario matemático en inglés para 2.º de ESO. El reto propone una secuencia de 30 desafíos variados, organizados en cinco niveles, y solicita un PIN personal al inicio."),
        P("Su finalidad principal es favorecer que el alumnado reconozca, comprenda y emplee léxico específico de Matemáticas en situaciones breves de respuesta. La actividad no sustituye la enseñanza explícita del vocabulario: la complementa mediante práctica guiada y repetible."),
        P("El uso de una interfaz de juego —niveles, progreso, racha, retroalimentación inmediata y resultado final— ofrece un contexto atractivo para recuperar palabras y expresiones que se emplearán en las explicaciones, enunciados y tareas de la materia."),
        P("<b>Distinción necesaria.</b> Son características verificadas de la aplicación los retos, los niveles, la corrección inmediata, la puntuación final y el desglose por categorías. La mejora del aprendizaje, la motivación o la autonomía son beneficios pedagógicos esperados que deberán valorarse mediante la observación docente y las evidencias de aula.", "Callout"),
    ]
    story += [P("Integración bilingüe", "H2"),
              bullet("El contenido matemático se mantiene presente mientras el inglés funciona como lengua de acceso, comprensión y comunicación."),
              bullet("Las preguntas combinan traducción, emparejamiento, ordenación, palabras desordenadas, expresiones y detección de errores."),
              bullet("La repetición permite revisar formas lingüísticas con una finalidad clara: interpretar y producir lenguaje matemático preciso.")]
    story += [P("Relación con AICLE/CLIL", "H2"),
              P("La propuesta es compatible con un enfoque AICLE/CLIL al articular contenido, comunicación y cognición en tareas cortas. El andamiaje aparece en las opciones de respuesta, las pistas y la organización progresiva de los niveles. Su aplicación en el aula puede reforzarse con una puesta en común de los términos que generen más duda.")]
    story.append(PageBreak())

    # 3. Objectives and content
    story += section_title(2, "Objetivos y contenidos")
    story += [P("Al finalizar la práctica, se espera que el alumnado pueda identificar y asociar vocabulario matemático básico en inglés con su significado en español, interpretar expresiones sencillas y usar el léxico como apoyo para comprender tareas bilingües.")]
    objectives = Table([
        [P("<b>Objetivos de trabajo</b>", "Body"), P("<b>Indicadores observables en la actividad</b>", "Body")],
        [P("Reconocer vocabulario matemático frecuente en inglés.", "Body"), P("Selecciona equivalencias y completa actividades de emparejamiento.", "Body")],
        [P("Relacionar lenguaje, símbolos y relaciones matemáticas.", "Body"), P("Resuelve expresiones y ordenaciones con términos matemáticos.", "Body")],
        [P("Revisar y corregir afirmaciones matemáticas sencillas.", "Body"), P("Participa en retos de detección de errores.", "Body")],
        [P("Regular la práctica mediante la repetición del reto.", "Body"), P("Consulta su resultado y decide si necesita practicar de nuevo.", "Body")],
    ], colWidths=[8.15 * cm, 8.35 * cm])
    objectives.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY), ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.4, LIGHT_GREY), ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BACKGROUND", (0, 1), (-1, -1), colors.white), ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, PALE_BLUE]),
        ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story += [objectives, P("Contenidos respaldados por el banco de vocabulario de la aplicación", "H2")]
    content = [
        ["Números", "Cardinales y ordinales: <i>one, twenty-one, first, twenty-first, hundredth</i>."],
        ["Operaciones y relaciones", "<i>addition, difference, product, quotient, plus, divided by, equals, greater than, less than</i>."],
        ["Divisibilidad", "<i>natural number, integer, divisor, multiple, prime number, lowest common multiple, greatest common divisor</i>."],
        ["Fracciones", "<i>fraction, numerator, denominator, equivalent fractions, simplify, a half, two thirds</i>."],
        ["Geometría", "<i>area, perimeter, angle, line, polygon, triangle, circle</i> y polígonos de distinto número de lados."],
        ["Porcentajes", "<i>percentage, increase, decrease, discount, tax, surcharge</i>."],
    ]
    content_table = Table([[P(f"<b>{a}</b>", "Small"), P(b, "Small")] for a, b in content], colWidths=[4.25 * cm, 12.25 * cm])
    content_table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.35, LIGHT_GREY), ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BACKGROUND", (0, 0), (0, -1), PALE_TEAL),
        ("LEFTPADDING", (0, 0), (-1, -1), 7), ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story += [content_table, Spacer(1, 5), P("Comprender estas palabras es relevante porque permite interpretar consignas, comparar relaciones y expresar razonamientos en la lengua vehicular de la materia.", "Callout"), PageBreak()]

    # 4. Procedure
    story += section_title(3, "Desarrollo de la actividad y papel del alumnado")
    story += [P("La propuesta puede desarrollarse de forma individual, en el aula o como práctica pautada. El docente contextualiza el reto, recuerda que el PIN es personal y establece el modo de entrega o de consulta del resultado que corresponda al grupo.")]
    steps = [
        ("1", "<b>Repasar el vocabulario.</b> Consultar los materiales de la SA1 y el documento de números en inglés facilitados por el profesorado."),
        ("2", "<b>Acceder al reto.</b> Abrir el enlace de MATH CHALLENGE 1 proporcionado para el grupo."),
        ("3", "<b>Introducir el PIN personal.</b> Escribirlo sin compartirlo ni mostrarlo a otras personas."),
        ("4", "<b>Resolver los desafíos.</b> Leer cuidadosamente las consignas en inglés, seleccionar o construir la respuesta y atender a la corrección mostrada."),
        ("5", "<b>Consultar el resultado.</b> Al finalizar, revisar la puntuación, los aciertos, los errores y el desglose por categorías que presenta la interfaz."),
        ("6", "<b>Repetir para practicar.</b> Volver a realizar el reto para consolidar los términos que han resultado más difíciles y comparar el resultado de forma orientativa."),
    ]
    step_table = Table([[P(f"<font color='#1F6FAE'><b>{n}</b></font>", "Body"), P(text, "Body")] for n, text in steps], colWidths=[1.0 * cm, 15.5 * cm])
    step_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LINEBELOW", (0, 0), (-1, -1), 0.35, LIGHT_GREY),
        ("LEFTPADDING", (0, 0), (-1, -1), 4), ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story += [step_table, Spacer(1, 8), P("Papel docente y uso de la puntuación", "H2"),
              P("La puntuación puede utilizarse como referencia formativa para que el propio alumnado identifique avances y necesidades de repaso. No debe interpretarse aisladamente como evidencia única de competencia lingüística o matemática. La memoria no presupone un sistema de seguimiento automático del progreso: la plataforma muestra un estado de envío del resultado, pero la gestión posterior debe confirmarse con la configuración docente correspondiente."),
              P("La repetición tiene valor cuando va acompañada de autorregulación: revisar la categoría con más errores, volver a los materiales de apoyo y aplicar una estrategia diferente en un nuevo intento.", "Callout"),
              PageBreak()]

    # 5. Captures
    story += section_title(4, "Capturas reales de la aplicación")
    story += [P("Las siguientes imágenes proceden de la aplicación publicada en el enlace indicado. Para preservar la privacidad, las capturas de recorrido se realizaron en una sesión de demostración con el identificador ficticio <i>Demo Student</i>; no contienen PIN ni datos de alumnado real.")]
    capture_table = Table([
        [image_with_caption("evidence_initial.png", "<b>Figura 1.</b> Pantalla inicial: solicita el PIN personal para acceder y anuncia 30 desafíos, retroalimentación inmediata y resultado final."),
         image_with_caption("evidence_question.png", "<b>Figura 2.</b> Ejemplo real de pregunta de opción múltiple sobre números; muestra nivel, contador, progreso y racha.")],
        [image_with_caption("evidence_feedback.png", "<b>Figura 3.</b> Corrección inmediata tras una respuesta correcta: la interfaz confirma el acierto y actualiza los indicadores."),
         image_with_caption("evidence_results.png", "<b>Figura 4.</b> Pantalla final con puntuación, aciertos, errores, tiempo, categorías y niveles. Los valores de esta captura son demostrativos.")],
    ], colWidths=[8.25 * cm, 8.25 * cm])
    capture_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 3),
        ("RIGHTPADDING", (0, 0), (-1, -1), 3), ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    story += [capture_table, P("Nota de verificación: la captura final documenta los elementos que la interfaz puede mostrar; no representa resultados reales ni calificaciones de alumnado.", "Small"), PageBreak()]

    # 6. Value and conclusion
    story += section_title(5, "Valor educativo, evaluación formativa y conclusiones")
    story += [P("La actividad aporta una oportunidad breve y estructurada para practicar el lenguaje específico de Matemáticas en inglés. Su formato permite alternar la recuperación de vocabulario, la comprensión de expresiones y la toma de decisiones ante distintas modalidades de reto.")]
    story += [P("Aportaciones pedagógicas esperadas", "H2"),
              bullet("<b>Gamificación y motivación:</b> los niveles, la progresión visual y el reto favorecen una experiencia de práctica más atractiva."),
              bullet("<b>Práctica deliberada:</b> la posibilidad de repetir ofrece nuevas oportunidades de recuperación y consolidación del léxico."),
              bullet("<b>Autonomía:</b> el alumnado puede utilizar la corrección y el desglose final para priorizar qué vocabulario necesita revisar."),
              bullet("<b>Evaluación formativa:</b> la puntuación y los errores orientan la conversación con el alumnado y pueden complementar otras evidencias de aula.")]
    story += [P("Criterios de uso responsable", "H2"),
              P("Conviene presentar el reto como una práctica de mejora y no como una única prueba de rendimiento. Para una lectura pedagógica rigurosa, el docente puede contrastar la puntuación con observaciones, producciones orales o escritas y tareas matemáticas contextualizadas. Si se solicita una captura de resultado, debe indicarse de forma clara el canal de entrega y las pautas de protección de datos aplicables."),
              P("<b>Conclusión.</b> MATH CHALLENGE 1 – SA1 ofrece un recurso coherente con el trabajo bilingüe en Matemáticas: acerca el vocabulario a una experiencia interactiva, facilita la práctica repetida y proporciona información inmediata para orientar el repaso. Su eficacia dependerá de su integración en la secuencia didáctica, del acompañamiento docente y del uso reflexivo que haga el alumnado de sus resultados.", "Callout"),
              Spacer(1, 1.2 * cm), P("Enlace verificado el 23 de octubre de 2026", "Small")]

    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build()
