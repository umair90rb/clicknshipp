const itemAbbreviationMapping = {
  JNT: "Joint On",
  NTO: "Night On",
  NRV: "Nerve On",
  STE: "Stiff Ease",
  RLX: "Relexo",
  HLT: "Heel it",
  PNT: "Penta",
  FUE: "Flu Ease",
  DGS: "Digesto",
  ELF: "Enlifto",
};

export default function getNameFromSubmissionLink(linkText) {
  const itemAbri = linkText.split("-")[0];
  return { name: itemAbbreviationMapping[itemAbri], abri: itemAbri };
}

export function getSizeAndPrice(sizeText) {
  const result = { size: "", price: "" };
  const [size, priceText] = sizeText.split("=");
  result.size = size.trim();
  const [fst, priceTrimmed] = priceText.split("Rs.");
  const [price, last] = priceTrimmed.split("/-");
  result.price = parseInt(price);
  return result;
}
