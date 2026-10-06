import type { Lang, Speaker } from "@interpreting-practice/shared";

export interface PracticeLine {
  from: Lang;
  speaker?: Speaker;
  text: string;
  model: string;
  /** The pieces checked for completeness and accuracy. */
  units: string[];
}

/** Short one-liners. Key terms use the glossary wording. */
export const sentences: PracticeLine[] = [
  {
    from: "en",
    text: "Do you have any chest pain?",
    model: "¿Tiene dolor en el pecho?",
    units: ["¿Tiene…?", "dolor en el pecho"],
  },
  {
    from: "en",
    text: "You need to fast after midnight.",
    model: "Necesita ayunar después de la medianoche.",
    units: ["Necesita", "ayunar", "después de la medianoche"],
  },
  {
    from: "en",
    text: "We are going to take a blood sample.",
    model: "Vamos a tomar una muestra de sangre.",
    units: ["Vamos a tomar", "una muestra de sangre"],
  },
  {
    from: "en",
    text: "Are you allergic to any medication?",
    model: "¿Es alérgico a algún medicamento?",
    units: ["¿Es alérgico", "a algún medicamento?"],
  },
  {
    from: "en",
    text: "Your blood pressure is borderline.",
    model: "Su presión arterial está en el límite.",
    units: ["Su presión arterial", "en el límite"],
  },
  {
    from: "en",
    text: "Take the stool softener every night.",
    model: "Tome el ablandador de heces todas las noches.",
    units: ["Tome", "el ablandador de heces", "todas las noches"],
  },
  {
    from: "en",
    text: "Have you had any blood in the stools?",
    model: "¿Ha tenido sangre en las heces?",
    units: ["¿Ha tenido", "sangre en las heces"],
  },
  {
    from: "en",
    text: "You will be discharged tomorrow morning.",
    model: "Mañana en la mañana le vamos a dar de alta.",
    units: ["mañana en la mañana", "dar de alta"],
  },
  {
    from: "en",
    text: "Bring your inhaler to every appointment.",
    model: "Traiga su inhalador a todas las citas.",
    units: ["Traiga", "su inhalador", "a todas las citas"],
  },
  {
    from: "en",
    text: "The nurse will check your vital signs every four hours.",
    model: "La enfermera le va a tomar los signos vitales cada cuatro horas.",
    units: ["La enfermera", "los signos vitales", "cada cuatro horas"],
  },
  {
    from: "es",
    text: "Tengo un dolor punzante en la ingle.",
    model: "I have a stabbing pain in my groin.",
    units: ["I have", "a stabbing pain", "in my groin"],
  },
  {
    from: "es",
    text: "Me dan escalofríos en la noche.",
    model: "I get chills at night.",
    units: ["I get chills", "at night"],
  },
  {
    from: "es",
    text: "Siento hormigueo en la planta del pie.",
    model: "I feel pins and needles on the sole of my foot.",
    units: ["I feel pins and needles", "on the sole of my foot"],
  },
  {
    from: "es",
    text: "Tengo agruras después de comer.",
    model: "I have heartburn after I eat.",
    units: ["I have heartburn", "after I eat"],
  },
  {
    from: "es",
    text: "Mi hijo tiene ronchas en la espalda.",
    model: "My son has hives on his back.",
    units: ["My son", "has hives", "on his back"],
  },
  {
    from: "es",
    text: "Estoy estreñido desde el lunes.",
    model: "I've been constipated since Monday.",
    units: ["I've been constipated", "since Monday"],
  },
  {
    from: "es",
    text: "Me salió una ampolla en el talón.",
    model: "I got a blister on my heel.",
    units: ["I got a blister", "on my heel"],
  },
  {
    from: "es",
    text: "La herida está supurando y huele mal.",
    model: "The wound is draining and it smells bad.",
    units: ["The wound", "is draining", "it smells bad"],
  },
  {
    from: "es",
    text: "Siento la mano izquierda entumecida.",
    model: "My left hand goes numb.",
    units: ["My left hand", "goes numb"],
  },
  {
    from: "es",
    text: "Tuve un desmayo en el trabajo.",
    model: "I had a fainting spell at work.",
    units: ["I had a fainting spell", "at work"],
  },
  {
    from: "en",
    text: "Please sign the consent form before the surgery.",
    model: "Por favor, firme el formulario de consentimiento antes de la cirugía.",
    units: ["firme", "el formulario de consentimiento", "antes de la cirugía"],
  },
  {
    from: "en",
    text: "Do you have a living will or an advance directive?",
    model: "¿Tiene un testamento vital o una directriz médica anticipada?",
    units: ["¿Tiene…?", "un testamento vital", "una directriz médica anticipada"],
  },
  {
    from: "en",
    text: "We need a urine sample for a urine culture.",
    model: "Necesitamos una muestra de orina para un cultivo de orina.",
    units: ["Necesitamos", "una muestra de orina", "un cultivo de orina"],
  },
  {
    from: "en",
    text: "Wear the compression stockings during the day.",
    model: "Use las medias de compresión durante el día.",
    units: ["Use", "las medias de compresión", "durante el día"],
  },
  {
    from: "en",
    text: "Your primary care physician will give you a referral.",
    model: "Su médico de cabecera le va a dar una referencia.",
    units: ["Su médico de cabecera", "le va a dar", "una referencia"],
  },
  {
    from: "en",
    text: "Have you ever had a seizure?",
    model: "¿Alguna vez ha tenido un ataque convulsivo?",
    units: ["¿Alguna vez ha tenido…?", "un ataque convulsivo"],
  },
  {
    from: "en",
    text: "Shake the cough syrup well before each dose.",
    model: "Agite bien el jarabe para la tos antes de cada dosis.",
    units: ["Agite bien", "el jarabe para la tos", "antes de cada dosis"],
  },
  {
    from: "en",
    text: "The staples will come out in ten days.",
    model: "Le van a quitar las grapas en diez días.",
    units: ["quitar", "las grapas", "en diez días"],
  },
  {
    from: "en",
    text: "Keep the incision clean and dry.",
    model: "Mantenga la incisión limpia y seca.",
    units: ["Mantenga", "la incisión", "limpia y seca"],
  },
  {
    from: "en",
    text: "Your baby needs the heel prick test before going home.",
    model: "Su bebé necesita la prueba del talón antes de irse a casa.",
    units: ["Su bebé necesita", "la prueba del talón", "antes de irse a casa"],
  },
  {
    from: "en",
    text: "Do not take this medicine on an empty stomach.",
    model: "No tome este medicamento en ayunas.",
    units: ["No tome", "este medicamento", "en ayunas"],
  },
  {
    from: "en",
    text: "Are you up to date on your flu shot?",
    model: "¿Tiene al día la vacuna de la gripe?",
    units: ["¿Tiene al día…?", "la vacuna de la gripe"],
  },
  {
    from: "en",
    text: "The side effects may include nausea and dizziness.",
    model: "Los efectos secundarios pueden incluir náuseas y mareos.",
    units: ["Los efectos secundarios", "pueden incluir", "náuseas y mareos"],
  },
  {
    from: "en",
    text: "You can buy this ointment over the counter.",
    model: "Puede comprar este ungüento sin receta.",
    units: ["Puede comprar", "este ungüento", "sin receta"],
  },
  {
    from: "en",
    text: "Use the peak flow meter every morning.",
    model: "Use el medidor de flujo máximo todas las mañanas.",
    units: ["Use", "el medidor de flujo máximo", "todas las mañanas"],
  },
  {
    from: "es",
    text: "Tengo comezón y ardor al orinar.",
    model: "I have itching and burning when I urinate.",
    units: ["I have itching", "and burning", "when I urinate"],
  },
  {
    from: "es",
    text: "Me torcí el tobillo jugando fútbol.",
    model: "I sprained my ankle playing soccer.",
    units: ["I sprained", "my ankle", "playing soccer"],
  },
  {
    from: "es",
    text: "Tengo la nariz tapada y dolor de garganta.",
    model: "I'm stuffed up and I have a sore throat.",
    units: ["I'm stuffed up", "I have a sore throat"],
  },
  {
    from: "es",
    text: "Siento un dolor opresivo en el pecho.",
    model: "I feel a crushing pain in my chest.",
    units: ["I feel", "a crushing pain", "in my chest"],
  },
  {
    from: "es",
    text: "El bebé está muy inquieto y no quiere comer.",
    model: "The baby is very fussy and doesn't want to eat.",
    units: ["The baby", "is very fussy", "doesn't want to eat"],
  },
  {
    from: "es",
    text: "Tengo sofocos todas las noches.",
    model: "I have hot flashes every night.",
    units: ["I have hot flashes", "every night"],
  },
  {
    from: "es",
    text: "Mi esposo está postrado en cama desde el derrame cerebral.",
    model: "My husband has been bedridden since the stroke.",
    units: ["My husband", "has been bedridden", "since the stroke"],
  },
  {
    from: "es",
    text: "Me sangran las encías cuando me cepillo.",
    model: "My gums bleed when I brush.",
    units: ["My gums bleed", "when I brush"],
  },
  {
    from: "es",
    text: "Tengo manchado vaginal y no me toca la menstruación.",
    model: "I have vaginal spotting and it's not time for my period.",
    units: ["I have vaginal spotting", "not time for my period"],
  },
  {
    from: "es",
    text: "El dolor me corre desde la espalda hasta la pierna.",
    model: "The pain radiates from my back down to my leg.",
    units: ["The pain radiates", "from my back", "down to my leg"],
  },
  {
    from: "es",
    text: "Se me hinchan los tobillos al final del día.",
    model: "My ankles swell at the end of the day.",
    units: ["My ankles swell", "at the end of the day"],
  },
  {
    from: "es",
    text: "Tengo una verruga en el dedo que no se quita.",
    model: "I have a wart on my finger that won't go away.",
    units: ["I have a wart", "on my finger", "won't go away"],
  },
  {
    from: "es",
    text: "Me siento triste y sin ánimo desde que nació el bebé.",
    model: "I've been feeling blue and listless since the baby was born.",
    units: ["feeling blue", "and listless", "since the baby was born"],
  },
  {
    from: "es",
    text: "Mi hija tiene piojos y le pica mucho la nuca.",
    model: "My daughter has lice and the nape of her neck itches a lot.",
    units: ["My daughter has lice", "the nape of her neck", "itches a lot"],
  },
  {
    from: "es",
    text: "Tengo calambres en las piernas en la madrugada.",
    model: "I get leg cramps in the early morning.",
    units: ["I get leg cramps", "in the early morning"],
  },
];

/** Long consecutive turns with numbers, negations and register to keep. */
export const turns: PracticeLine[] = [
  {
    from: "en",
    speaker: "Provider",
    text: "Take two tablets of 500 milligrams every eight hours with food, and don't take more than six tablets in one day.",
    model:
      "Tome dos tabletas de 500 miligramos cada ocho horas con alimentos, y no tome más de seis tabletas en un día.",
    units: [
      "dos tabletas",
      "500 miligramos",
      "cada ocho horas",
      "con alimentos",
      "no tome más de seis",
      "en un día",
    ],
  },
  {
    from: "en",
    speaker: "Provider",
    text: "Your blood sugar reading this morning was 240. That's high. I want you to check your glucose before every meal and write down the numbers.",
    model:
      "Su lectura de la glucosa sanguínea de esta mañana fue de 240. Eso está alto. Quiero que se mida la glucosa antes de cada comida y que anote los números.",
    units: [
      "lectura de la glucosa sanguínea",
      "esta mañana",
      "240",
      "está alto",
      "antes de cada comida",
      "anote los números",
    ],
  },
  {
    from: "en",
    speaker: "Provider",
    text: "The CT scan shows a small kidney stone, about four millimeters. Most stones this size pass on their own, but if you have fever or chills, go to the emergency room right away.",
    model:
      "La tomografía computarizada muestra un cálculo renal pequeño, de unos cuatro milímetros. La mayoría de los cálculos de este tamaño salen solos, pero si tiene fiebre o escalofríos, vaya a la sala de emergencias de inmediato.",
    units: [
      "tomografía computarizada",
      "cálculo renal pequeño",
      "cuatro milímetros",
      "salen solos",
      "fiebre o escalofríos",
      "sala de emergencias de inmediato",
    ],
  },
  {
    from: "en",
    speaker: "Provider",
    text: "Before the colonoscopy you can't eat solid food for 24 hours. Clear liquids are fine. Stop the blood thinner five days before the procedure.",
    model:
      "Antes de la colonoscopia no puede comer alimentos sólidos durante 24 horas. Los líquidos claros están bien. Deje de tomar el anticoagulante cinco días antes del procedimiento.",
    units: [
      "colonoscopia",
      "no puede comer sólidos",
      "24 horas",
      "líquidos claros están bien",
      "deje el anticoagulante",
      "cinco días antes del procedimiento",
    ],
  },
  {
    from: "en",
    speaker: "Provider",
    text: "Your daughter has strep throat. Give her the antibiotic twice a day for ten days, even if she feels better on day three.",
    model:
      "Su hija tiene faringitis estreptocócica. Dele el antibiótico dos veces al día durante diez días, aunque se sienta mejor al tercer día.",
    units: [
      "faringitis estreptocócica",
      "el antibiótico",
      "dos veces al día",
      "diez días",
      "aunque se sienta mejor",
      "al tercer día",
    ],
  },
  {
    from: "en",
    speaker: "Provider",
    text: "I'm not going to soften this. The biopsy came back positive. We need to start chemotherapy within two weeks.",
    model:
      "No le voy a suavizar esto. La biopsia salió positiva. Tenemos que empezar la quimioterapia dentro de dos semanas.",
    units: [
      "no le voy a suavizar esto (register kept)",
      "la biopsia",
      "salió positiva",
      "quimioterapia",
      "dentro de dos semanas",
    ],
  },
  {
    from: "es",
    speaker: "Patient",
    text: "Doctor, desde hace tres días tengo un dolor sordo en el lado derecho, y anoche se volvió punzante. También vomité dos veces.",
    model:
      "Doctor, for the past three days I've had a dull pain on my right side, and last night it became stabbing. I also vomited twice.",
    units: ["for three days", "dull pain", "right side", "last night", "became stabbing", "vomited twice"],
  },
  {
    from: "es",
    speaker: "Patient",
    text: "Mi mamá es diabética y se inyecta insulina dos veces al día, pero ayer no comió nada y su glucosa bajó a 55.",
    model:
      "My mom is diabetic and she injects insulin twice a day, but yesterday she didn't eat anything and her glucose dropped to 55.",
    units: [
      "my mom is diabetic",
      "injects insulin",
      "twice a day",
      "yesterday didn't eat anything",
      "glucose dropped",
      "55",
    ],
  },
  {
    from: "es",
    speaker: "Patient",
    text: "No, no he tenido sangre en las heces, pero sí tengo diarrea y retorcijones desde el sábado.",
    model: "No, I haven't had blood in my stools, but I do have diarrhea and cramps since Saturday.",
    units: [
      "No, I haven't had",
      "blood in the stools",
      "but I do have",
      "diarrhea and cramps",
      "since Saturday",
    ],
  },
  {
    from: "es",
    speaker: "Patient",
    text: "Me dieron de alta el martes, pero la incisión está roja, hinchada y le sale un líquido amarillo.",
    model:
      "I was discharged on Tuesday, but the incision is red, swollen, and a yellow fluid is coming out of it.",
    units: ["I was discharged", "on Tuesday", "the incision", "red, swollen", "yellow fluid coming out"],
  },
  {
    from: "es",
    speaker: "Patient",
    text: "El dolor de cabeza es palpitante, me da de un solo lado, y la luz me molesta mucho.",
    model: "The headache is throbbing, it's only on one side, and light bothers me a lot.",
    units: ["the headache", "throbbing", "only on one side", "light bothers me a lot"],
  },
  {
    from: "es",
    speaker: "Patient",
    text: "Soy alérgica a la penicilina. La última vez me salieron ronchas y se me cerró la garganta.",
    model: "I'm allergic to penicillin. Last time I broke out in hives and my throat closed up.",
    units: ["I'm allergic", "to penicillin", "last time", "hives", "my throat closed up"],
  },
  {
    from: "en",
    speaker: "Provider",
    text: "Your LDL, the bad cholesterol, is 190. I'm starting you on a statin, 20 milligrams at bedtime. We'll repeat the blood test in three months.",
    model:
      "Su LDL, el colesterol malo, está en 190. Le voy a empezar una estatina, 20 miligramos a la hora de dormir. Vamos a repetir el análisis de sangre en tres meses.",
    units: [
      "el colesterol malo",
      "190",
      "una estatina",
      "20 miligramos",
      "a la hora de dormir",
      "repetir el análisis de sangre",
      "en tres meses",
    ],
  },
  {
    from: "en",
    speaker: "Provider",
    text: "After the epidural you may feel numb from the waist down. Don't try to get out of bed on your own; press the call button and the nurse will help you.",
    model:
      "Después de la epidural puede sentirse entumecida de la cintura para abajo. No trate de levantarse de la cama sola; oprima el botón de llamada y la enfermera la va a ayudar.",
    units: [
      "después de la epidural",
      "entumecida",
      "de la cintura para abajo",
      "no trate de levantarse sola",
      "el botón de llamada",
      "la enfermera la va a ayudar",
    ],
  },
  {
    from: "en",
    speaker: "Provider",
    text: "The X-rays don't show a fracture, just a bad sprain. Keep the ankle elevated, put ice on it for twenty minutes at a time, and don't put weight on it for a week.",
    model:
      "Los rayos X no muestran una fractura, solo una torcedura fuerte. Mantenga el tobillo elevado, póngale hielo por veinte minutos a la vez, y no le ponga peso durante una semana.",
    units: [
      "los rayos X",
      "no muestran una fractura",
      "una torcedura fuerte",
      "tobillo elevado",
      "hielo veinte minutos a la vez",
      "no le ponga peso",
      "una semana",
    ],
  },
  {
    from: "en",
    speaker: "Provider",
    text: "If your baby has fewer than six wet diapers a day or a fever over 100.4, call the pediatrician. Don't give any medicine without asking first.",
    model:
      "Si su bebé moja menos de seis pañales al día o tiene fiebre de más de 100.4, llame al pediatra. No le dé ningún medicamento sin preguntar primero.",
    units: [
      "menos de seis pañales mojados",
      "al día",
      "fiebre de más de 100.4",
      "llame al pediatra",
      "no le dé ningún medicamento",
      "sin preguntar primero",
    ],
  },
  {
    from: "en",
    speaker: "Provider",
    text: "We're admitting you to the Intensive Care Unit. Your heart rhythm is irregular, so we'll keep you on a monitor and give you a blood thinner through the IV.",
    model:
      "Lo vamos a ingresar a la Unidad de Cuidados Intensivos. Su ritmo cardíaco está irregular, así que lo vamos a tener en un monitor y le vamos a dar un anticoagulante por la intravenosa.",
    units: [
      "ingresar",
      "Unidad de Cuidados Intensivos",
      "ritmo cardíaco irregular",
      "en un monitor",
      "un anticoagulante",
      "por la intravenosa",
    ],
  },
  {
    from: "en",
    speaker: "Provider",
    text: "You have gestational diabetes. That doesn't mean you'll have diabetes forever, but you need to follow a strict regimen and see the dietitian this week.",
    model:
      "Usted tiene diabetes gestacional. Eso no quiere decir que va a tener diabetes para siempre, pero necesita seguir un régimen estricto y ver a la dietista esta semana.",
    units: [
      "diabetes gestacional",
      "no quiere decir",
      "para siempre",
      "un régimen estricto",
      "la dietista",
      "esta semana",
    ],
  },
  {
    from: "en",
    speaker: "Provider",
    text: "Have you had any shortness of breath, swelling in your legs, or chest pain when you climb stairs? Answer yes or no to each one.",
    model:
      "¿Ha tenido falta de aire, hinchazón en las piernas o dolor en el pecho al subir escaleras? Conteste sí o no a cada una.",
    units: [
      "falta de aire",
      "hinchazón en las piernas",
      "dolor en el pecho",
      "al subir escaleras",
      "conteste sí o no",
      "a cada una",
    ],
  },
  {
    from: "en",
    speaker: "Provider",
    text: "Frankly, if you keep smoking, the emphysema will get worse. I can't make that decision for you, but I can refer you to a program that helps.",
    model:
      "Francamente, si sigue fumando, el enfisema va a empeorar. Yo no puedo tomar esa decisión por usted, pero lo puedo referir a un programa que ayuda.",
    units: [
      "francamente (register kept)",
      "si sigue fumando",
      "el enfisema",
      "va a empeorar",
      "no puedo tomar esa decisión por usted",
      "referir a un programa",
    ],
  },
  {
    from: "en",
    speaker: "Provider",
    text: "Your discharge instructions are on this sheet. No driving for two weeks, no lifting more than ten pounds, and your follow-up appointment is on the 14th.",
    model:
      "Sus instrucciones de alta están en esta hoja. No maneje durante dos semanas, no levante más de diez libras, y su cita de seguimiento es el día 14.",
    units: [
      "instrucciones de alta",
      "no maneje",
      "dos semanas",
      "no levante más de diez libras",
      "cita de seguimiento",
      "el día 14",
    ],
  },
  {
    from: "es",
    speaker: "Patient",
    text: "Tengo 32 semanas de embarazo y desde esta mañana tengo contracciones cada diez minutos. Además, el bebé se está moviendo menos.",
    model:
      "I'm 32 weeks pregnant and since this morning I've had contractions every ten minutes. Also, the baby is moving less.",
    units: [
      "32 weeks pregnant",
      "since this morning",
      "contractions",
      "every ten minutes",
      "the baby is moving less",
    ],
  },
  {
    from: "es",
    speaker: "Patient",
    text: "No me he tomado la pastilla de la presión desde hace una semana porque se me acabó y no tenía para el resurtido.",
    model:
      "I haven't taken my blood pressure pill for a week because I ran out and I couldn't afford the refill.",
    units: [
      "I haven't taken",
      "blood pressure pill",
      "for a week",
      "I ran out",
      "couldn't afford the refill",
    ],
  },
  {
    from: "es",
    speaker: "Patient",
    text: "Mi papá se cayó en el baño hace dos horas. No se pegó en la cabeza, pero no puede mover el brazo derecho y está muy aturdido.",
    model:
      "My dad fell in the bathroom two hours ago. He didn't hit his head, but he can't move his right arm and he's very groggy.",
    units: [
      "my dad fell",
      "in the bathroom",
      "two hours ago",
      "didn't hit his head",
      "can't move his right arm",
      "very groggy",
    ],
  },
  {
    from: "es",
    speaker: "Patient",
    text: "El dolor empezó en el ombligo y ahora está abajo a la derecha. Es constante, no va y viene, y me duele más cuando toso.",
    model:
      "The pain started at my belly button and now it's in the lower right. It's constant, it doesn't come and go, and it hurts more when I cough.",
    units: [
      "started at my belly button",
      "now lower right",
      "constant",
      "doesn't come and go",
      "hurts more when I cough",
    ],
  },
  {
    from: "es",
    speaker: "Patient",
    text: "Estoy amamantando y tengo el pecho izquierdo rojo, caliente y muy sensible. Ayer tuve fiebre de 101.",
    model:
      "I'm breastfeeding and my left breast is red, warm, and very tender. Yesterday I had a fever of 101.",
    units: ["I'm breastfeeding", "left breast", "red, warm", "very tender", "yesterday", "fever of 101"],
  },
  {
    from: "es",
    speaker: "Patient",
    text: "Mire, yo no quiero que me pongan en una máquina si ya no hay esperanza. Mis hijos saben lo que quiero, pero no lo tengo por escrito.",
    model:
      "Look, I don't want to be put on a machine if there's no hope left. My children know what I want, but I don't have it in writing.",
    units: [
      "look (register kept)",
      "I don't want to be put on a machine",
      "if there's no hope left",
      "my children know what I want",
      "I don't have it in writing",
    ],
  },
  {
    from: "es",
    speaker: "Patient",
    text: "Ni he tenido diarrea ni he vomitado, pero llevo cuatro días sin evacuar y tengo el estómago muy inflamado.",
    model:
      "I haven't had diarrhea or vomited, but I haven't had a bowel movement in four days and my stomach is very bloated.",
    units: ["haven't had diarrhea or vomited", "no bowel movement", "in four days", "stomach very bloated"],
  },
  {
    from: "es",
    speaker: "Patient",
    text: "Me inyecto 30 unidades de insulina en la mañana y 15 en la noche, y anoche la lectura de glucosa fue de 310.",
    model:
      "I inject 30 units of insulin in the morning and 15 at night, and last night my glucose reading was 310.",
    units: ["30 units of insulin", "in the morning", "15 at night", "last night", "glucose reading", "310"],
  },
  {
    from: "es",
    speaker: "Patient",
    text: "Desde la operación siento hormigueo en los dedos de los pies y a veces un dolor como un choque eléctrico que me sube por la pierna.",
    model:
      "Since the surgery I've had pins and needles in my toes and sometimes a shock-like pain that shoots up my leg.",
    units: [
      "since the surgery",
      "pins and needles",
      "in my toes",
      "sometimes",
      "shock-like pain",
      "shoots up my leg",
    ],
  },
];
