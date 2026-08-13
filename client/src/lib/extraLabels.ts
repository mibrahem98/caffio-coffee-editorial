export type ExtraUi = {
  searchPrompts: string;
  filterBy: string;
  allTypes: string;
  showing: string;
  reset: string;
  lightMode: string;
  darkMode: string;
  downloadAll: string;
  noResults: string;
};

export const extraUi: Record<"en" | "ar" | "fr" | "es", ExtraUi> = {
  en: { searchPrompts: "Search prompts...", filterBy: "Filter by type", allTypes: "All types", showing: "showing", reset: "Reset", lightMode: "Light mode", darkMode: "Dark mode", downloadAll: "Download all", noResults: "No prompts match this search." },
  ar: { searchPrompts: "ابحث في البرومبتات...", filterBy: "التصفية حسب النوع", allTypes: "كل الأنواع", showing: "عرض", reset: "إعادة ضبط", lightMode: "الوضع الفاتح", darkMode: "الوضع الليلي", downloadAll: "تنزيل الكل", noResults: "لا توجد برومبتات مطابقة." },
  fr: { searchPrompts: "Rechercher dans les prompts...", filterBy: "Filtrer par type", allTypes: "Tous les types", showing: "résultats", reset: "Réinitialiser", lightMode: "Mode clair", darkMode: "Mode sombre", downloadAll: "Tout télécharger", noResults: "Aucun prompt ne correspond à cette recherche." },
  es: { searchPrompts: "Buscar prompts...", filterBy: "Filtrar por tipo", allTypes: "Todos los tipos", showing: "resultados", reset: "Restablecer", lightMode: "Modo claro", darkMode: "Modo oscuro", downloadAll: "Descargar todo", noResults: "Ningún prompt coincide con esta búsqueda." },
};
