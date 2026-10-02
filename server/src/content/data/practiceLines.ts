import type { Lang, Speaker } from "@isa-drill-room/shared";

export interface PracticeLine {
  from: Lang;
  speaker?: Speaker;
  text: string;
  model: string;
  /** The pieces a rater checks for completeness and accuracy. */
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
    text: "Se me duerme la mano izquierda.",
    model: "My left hand goes numb.",
    units: ["My left hand", "goes numb"],
  },
  {
    from: "es",
    text: "Tuve un desmayo en el trabajo.",
    model: "I had a fainting spell at work.",
    units: ["I had a fainting spell", "at work"],
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
];
