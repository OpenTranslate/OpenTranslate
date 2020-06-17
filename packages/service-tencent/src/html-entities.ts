export function decodeHTMLEntities(text: string): string {
  return text.replace(/&([^;]+);/gm, (match, entity) => {
    switch (entity) {
      case "amp":
        return "&";
      case "apos":
        return "'";
      case "#x27":
        return "'";
      case "#x2F":
        return "/";
      case "#39":
        return "'";
      case "#47":
        return "/";
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "nbsp":
        return " ";
      case "quot":
        return '"';
      default:
        return match;
    }
  });
}
