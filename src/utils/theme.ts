export const getActiveEvent = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // List of big movie events
  const events = [
    {
      name: "Michael",
      start: new Date(currentYear, 3, 26), // April 26
      end: new Date(currentYear, 4, 3),    // May 3
      color: "text-yellow-500",           // Gold
      accent: "bg-yellow-500"
    },
    {
      name: "Deadpool & Wolverine",
      start: new Date(currentYear, 6, 26), // July 26
      end: new Date(currentYear, 7, 2),    // Aug 2
      color: "text-yellow-400",           // Bright Yellow
      accent: "bg-yellow-400"
    },
    {
      name: "Joker 2",
      start: new Date(currentYear, 9, 4),  // Oct 4
      end: new Date(currentYear, 9, 11),   // Oct 11
      color: "text-purple-500",           // Joker Purple
      accent: "bg-purple-500"
    }
  ];

  return events.find(event => today >= event.start && today <= event.end) || null;
};

export const getThemeConfig = () => {
  const activeEvent = getActiveEvent();
  
  return {
    isEventActive: !!activeEvent,
    eventName: activeEvent?.name || "",
    brandName: "MUSTI",
    primaryColor: activeEvent?.color || "text-red-600",
    accentColor: activeEvent?.accent || "bg-red-600",
    hoverColor: activeEvent ? `hover:${activeEvent.color}` : "hover:text-red-500",
  };
};
