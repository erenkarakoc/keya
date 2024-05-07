const getUserRoleText = (text: string) => {
  switch (text) {
    case "admin":
      return "Yönetici"
    case "broker":
      return "Broker"
    case "assistant":
      return "Ofis Asistanı"
    case "human-resources":
      return "İnsan Kaynakları"
    case "franchise-manager":
      return "Franchise Yöneticisi"
    case "agent":
      return "Gayrimenkul Danışmanı"
    default:
      ""
  }
}

const slugify = (str: string) => {
  const trMap: { [key: string]: string } = {
    çÇ: "c",
    ğĞ: "g",
    şŞ: "s",
    üÜ: "u",
    ıİ: "i",
    öÖ: "o",
  }

  for (const key in trMap) {
    str = str.replace(new RegExp("[" + key + "]", "g"), trMap[key])
  }

  str = str
    .replace(/[^a-zA-Z0-9@.]+/gi, "")
    .replace(/\s+/g, "-")
    .toLowerCase()

  return str
}

export { getUserRoleText, slugify }
