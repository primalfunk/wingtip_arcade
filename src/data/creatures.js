const creatures = [
  {
    name: "Phoenix",
    culture: "Greek",
    trait: "rebirth from ashes",
    image: "/assets/creatures/phoenix.png",
    bio: "The Phoenix is a legendary bird of Greek mythology that lives for centuries before bursting into flames and being reborn from its own ashes. It symbolizes immortality, resilience, and eternal renewal."
  },
  {
    name: "Kitsune",
    culture: "Japanese",
    trait: "shapeshifting fox",
    image: "/assets/creatures/kitsune.png",
    bio: "The Kitsune is a magical fox spirit from Japanese folklore, known for its intelligence, mischievous nature, and ability to shapeshift into human form. Some are protectors, others playful tricksters."
  },
  {
    name: "Banshee",
    culture: "Irish",
    trait: "wails to foretell death",
    image: "/assets/creatures/banshee.png",
    bio: "In Irish mythology, the Banshee is a ghostly woman whose mournful wails foretell death. She drifts across misty fields and lonely moors, a sorrowful harbinger of loss."
  },
  {
    name: "Quetzalcoatl",
    culture: "Aztec",
    trait: "feathered serpent god",
    image: "/assets/creatures/quetzalcoatl.png",
    bio: "Quetzalcoatl, the Feathered Serpent, is a god of wisdom, wind, and creation in Aztec mythology. Often depicted with radiant feathers, he bridges earth and sky in ancient lore."
  },
  {
    name: "Anansi",
    culture: "West African",
    trait: "trickster spider",
    image: "/assets/creatures/anansi.png",
    bio: "Anansi is a clever spider trickster from West African folklore, known for outwitting stronger creatures through cunning and storytelling. His tales teach lessons about wit and survival."
  },
  {
    name: "Kraken",
    culture: "Norse",
    trait: "giant sea monster",
    image: "/assets/creatures/kraken.png",
    bio: "The Kraken is a colossal sea monster from Norse legend, said to dwell off the coasts of Norway and Greenland. Its massive tentacles could drag entire ships beneath the waves."
  },
  {
    name: "Chimera",
    culture: "Greek",
    trait: "lion, goat, and serpent hybrid",
    image: "/assets/creatures/chimera.png",
    bio: "The Chimera is a fearsome Greek creature composed of lion, goat, and serpent parts, breathing fire and sowing terror. It embodies chaos and unnatural fusion in mythology."
  },
  {
    name: "Jorogumo",
    culture: "Japanese",
    trait: "spider woman who lures victims",
    image: "/assets/creatures/jorogumo.png",
    bio: "The Jorogumo is a haunting figure from Japanese lore: a giant spider that transforms into a beautiful woman to ensnare and devour unsuspecting travelers."
  },
  {
    name: "Wendigo",
    culture: "Algonquian",
    trait: "cannibalistic forest spirit",
    image: "/assets/creatures/wendigo.png",
    bio: "The Wendigo is a terrifying spirit from Algonquian mythology, embodying insatiable greed and cannibalism. It haunts snowy forests, ever-hungry and chilling to behold."
  },
  {
    name: "Thunderbird",
    culture: "Native American",
    trait: "bird that creates thunder",
    image: "/assets/creatures/thunderbird.png",
    bio: "The Thunderbird is a powerful being in Native American mythology, whose wings create thunder and lightning. It is often seen as a guardian spirit of strength and storms."
  },
  {
    name: "Baba Yaga",
    culture: "Slavic",
    trait: "witch who lives in a chicken-legged hut",
    image: "/assets/creatures/baba_yaga.png",
    bio: "Baba Yaga is a fearsome witch of Slavic folklore who dwells in a hut that stands on giant chicken legs. She is a guardian of the forest and a figure of both wisdom and terror."
  },
  {
    name: "Nuckelavee",
    culture: "Scottish",
    trait: "skinless horse demon",
    image: "/assets/creatures/nuckelavee.png",
    bio: "The Nuckelavee is a monstrous horse demon from Scottish mythology, known for its grotesque, skinless body and poisonous breath that brings plague and blight wherever it roams."
  },
  {
    name: "Tikbalang",
    culture: "Filipino",
    trait: "trickster with a horse's head",
    image: "/assets/creatures/tikbalang.png",
    bio: "The Tikbalang is a mischievous creature from Filipino folklore, with the head of a horse and the body of a human. It leads travelers astray and delights in harmless trickery."
  },
  {
    name: "Zmey Gorynych",
    culture: "Russian",
    trait: "three-headed dragon",
    image: "/assets/creatures/zmey_gorynych.png",
    bio: "Zmey Gorynych is a fearsome three-headed dragon from Russian legend, breathing fire and guarding treasures or kidnapping princesses. Heroes must outwit or outfight him to prevail."
  },
  {
    name: "Selkie",
    culture: "Scottish",
    trait: "seal that transforms into a human",
    image: "/assets/creatures/selkie.png",
    bio: "Selkies are mystical beings from Scottish folklore who live as seals in the sea but shed their skins to become human on land. Their stories often carry themes of love and longing."
  },
  {
    name: "Ammit",
    culture: "Egyptian",
    trait: "devourer of unworthy souls",
    image: "/assets/creatures/ammit.png",
    bio: "Ammit is a terrifying creature of Egyptian mythology, part crocodile, lion, and hippopotamus, who devours the souls of the unworthy after judgment in the afterlife."
  },
  {
    name: "Tengu",
    culture: "Japanese",
    trait: "bird-like forest warrior",
    image: "/assets/creatures/tengu.png",
    bio: "Tengu are fierce and proud bird-like beings from Japanese mythology, often depicted as guardians of the mountains and forests, skilled in martial arts and magic."
  },
  {
    name: "Minotaur",
    culture: "Greek",
    trait: "bull-headed labyrinth guardian",
    image: "/assets/creatures/minotaur.png",
    bio: "The Minotaur, a half-man, half-bull monster from Greek myth, was imprisoned within a labyrinth by King Minos. It symbolizes entrapment, ferocity, and the battle against inner beasts."
  },
  {
    name: "Camazotz",
    culture: "Mayan",
    trait: "bat god of death",
    image: "/assets/creatures/camazotz.png",
    bio: "Camazotz is the bat god of death in Mayan mythology, associated with night, sacrifice, and the underworld. His fearsome wings bring darkness and dread."
  },
  {
    name: "Yeti",
    culture: "Tibetan",
    trait: "abominable snowman",
    image: "/assets/creatures/yeti.png",
    bio: "The Yeti, also known as the Abominable Snowman, is a legendary creature said to roam the snowy peaks of the Himalayas. Its elusive nature fuels mystery and awe."
  },
  {
    name: "Pontianak",
    culture: "Malay",
    trait: "female vampiric ghost",
    image: "/assets/creatures/pontianak.png",
    bio: "The Pontianak is a vengeful female spirit from Malay folklore, often appearing as a beautiful woman who preys on unsuspecting victims. She is a haunting embodiment of tragedy and rage."
  },
  {
    name: "Gorgon",
    culture: "Greek",
    trait: "gaze turns others to stone",
    image: "/assets/creatures/gorgon.png",
    bio: "Gorgons, like the infamous Medusa, are monstrous figures from Greek mythology whose terrifying gaze can turn anyone to stone. They are symbols of primal fear and power."
  },
  {
    name: "Barong",
    culture: "Balinese",
    trait: "lion spirit who fights evil",
    image: "/assets/creatures/barong.png",
    bio: "Barong is a lion-like spirit in Balinese mythology who represents good and battles evil forces. Vibrant and theatrical, Barong is a protector figure celebrated in lively performances."
  },
  {
    name: "Mokele-mbembe",
    culture: "Congo River Basin",
    trait: "dinosaur-like river beast",
    image: "/assets/creatures/mokele-mbembe.png",
    bio: "Mokele-mbembe is a legendary creature of the Congo River Basin, often described as a living dinosaur. It moves silently through swampy waters, shrouded in mystery and legend."
  },
  {
    name: "Baku",
    culture: "Japanese",
    trait: "dream-eating chimera",
    image: "/assets/creatures/baku.png",
    bio: "The Baku is a dream-eating creature from Japanese folklore, said to devour nightmares. Often depicted with features of many animals, it is both a protector and a mysterious being."
  },
  {
    name: "Jinn",
    culture: "Arabic",
    trait: "supernatural being of smokeless fire",
    image: "/assets/creatures/jinn.png",
    bio: "Jinn are supernatural beings from Arabic mythology, born of smokeless fire. They live in a world parallel to ours and can be benevolent, malevolent, or neutral."
  },
  {
    name: "Ittan-Momen",
    culture: "Japanese",
    trait: "haunted roll of cloth",
    image: "/assets/creatures/ittan-momen.png",
    bio: "The Ittan-Momen is a ghostly entity from Japanese folklore that appears as a long strip of cloth, flying through the night and sometimes smothering unwary travelers."
  },
  {
    name: "Cerberus",
    culture: "Greek",
    trait: "three-headed guardian of the underworld",
    image: "/assets/creatures/cerberus.png",
    bio: "Cerberus is the fearsome three-headed hound who guards the gates of the underworld in Greek mythology, preventing the dead from escaping and the living from entering."
  },
  {
    name: "Teju Jagua",
    culture: "Guarani",
    trait: "lizard with seven dog heads",
    image: "/assets/creatures/teju_jagua.png",
    bio: "Teju Jagua is a creature from Guarani mythology, described as a lizard-like beast with seven snarling dog heads. It guards hidden treasures in the forest depths."
  },
  {
    name: "Roc",
    culture: "Arabic",
    trait: "giant eagle able to carry elephants",
    image: "/assets/creatures/roc.png",
    bio: "The Roc is a legendary bird of enormous size from Arabic mythology, so massive it can carry elephants through the skies. It symbolizes awe-inspiring power and mystery."
  },
  {
    name: "Aswang",
    culture: "Filipino",
    trait: "shapeshifter that preys on humans",
    image: "/assets/creatures/aswang.png",
    bio: "The Aswang is a shape-shifting creature from Filipino folklore, often feared as a night-stalking monster that preys on humans. It embodies deep cultural fears of deception and darkness."
  },
  {
    name: "Strigoi",
    culture: "Romanian",
    trait: "undead spirit that drains vitality",
    image: "/assets/creatures/strigoi.png",
    bio: "Strigoi are undead spirits in Romanian mythology, restless souls that rise from the grave to drain the life from the living. They are early inspirations for modern vampire legends."
  },
  {
    name: "Charybdis",
    culture: "Greek",
    trait: "sea monster creating deadly whirlpools",
    image: "/assets/creatures/charybdis.png",
    bio: "Charybdis is a monstrous sea creature from Greek mythology that creates deadly whirlpools capable of swallowing entire ships. Sailors lived in terror of her wrathful tides."
  },
  {
    name: "Jengu",
    culture: "Sawa (Cameroon)",
    trait: "water spirits that bring good fortune",
    image: "/assets/creatures/jengu.png",
    bio: "Jengu are water spirits from the Sawa people of Cameroon, believed to bring healing and prosperity. They are often depicted as beautiful beings who dwell in rivers and oceans."
  },
  {
    name: "Kishi",
    culture: "Angolan",
    trait: "two-faced demon with human and hyena head",
    image: "/assets/creatures/kishi.png",
    bio: "The Kishi is a two-faced demon from Angolan folklore, charming with its human face but revealing a vicious hyena on the back of its head. It is a master of deception and danger."
  },
  {
    name: "Grootslang",
    culture: "South African",
    trait: "giant serpent with elephantine features",
    image: "/assets/creatures/grootslang.png",
    bio: "The Grootslang is an ancient creature from South African mythology, a massive serpent with elephantine traits, said to guard vast treasure hoards deep within hidden caves."
  },
  {
    name: "Kappa",
    culture: "Japanese",
    trait: "turtle-like water trickster with a head bowl",
    image: "/assets/creatures/kappa.png",
    bio: "Kappa are mischievous turtle-like creatures from Japanese folklore, with water-filled bowls on their heads. While often tricksters, they can also be helpful if treated with respect."
  },
  {
    name: "Impundulu",
    culture: "Zulu",
    trait: "lightning bird that feeds on blood",
    image: "/assets/creatures/impundulu.png",
    bio: "The Impundulu, or lightning bird, is a powerful creature from Zulu mythology, capable of summoning storms and striking with lightning. It is said to feed on the blood of the living."
  },
  {
    name: "Mbwiri",
    culture: "Central African",
    trait: "possessing spirit of illness and healing",
    image: "/assets/creatures/mbwiri.png",
    bio: "Mbwiri are spirits from Central African tradition that can cause illness or bring healing, depending on how they are treated. Rituals are performed to either appease or expel them."
  },
  {
    name: "Encantado",
    culture: "Brazilian",
    trait: "river dolphin that transforms into a human",
    image: "/assets/creatures/encantado.png",
    bio: "Encantados are shapeshifting river dolphins from Brazilian folklore who can transform into beautiful humans, often appearing at festivals and seducing villagers into the river world."
  },
  {
    name: "Peryton",
    culture: "Medieval European",
    trait: "winged stag casting human shadow",
    image: "/assets/creatures/peryton.png",
    bio: "Perytons are mythical creatures with the body of a stag and the wings of a bird, whose shadows take human form. They are mysterious omens blending beauty and darkness."
  },
  {
    name: "Leshy",
    culture: "Slavic",
    trait: "forest guardian that leads wanderers astray",
    image: "/assets/creatures/leshy.png",
    bio: "The Leshy is a powerful forest spirit from Slavic mythology, a guardian of beasts and trees. Playful yet dangerous, it delights in leading travelers astray deep into the woods."
  },
  {
    name: "Cherufe",
    culture: "Mapuche",
    trait: "lava monster that demands sacrifices",
    image: "/assets/creatures/cherufe.png",
    bio: "Cherufe is a monstrous being from Mapuche mythology, born of volcanic fire and molten rock. Legends say it demands human sacrifices to prevent devastating eruptions."
  },

];
export default creatures;
