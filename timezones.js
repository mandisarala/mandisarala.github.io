// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: clock;

// TimeZones Widget for Scriptable
// Author: Fernando Crespo
// Version: 1.0
//
// This script supports all widget sizes, but the number of timezones differ as follow:
// 
// Small Widget: up to 2 timezones
// Medium Widget: up to 4 timezones
// Large Widget: up to 8 timezones (two rows of 4)
//
// Time Zones names can be taken from https://gist.github.com/rxaviers/8481876
//
// Global config: 
// - timeFormat: Format of display time. Defaults to "H:mm" (eg. 09:42).
// - weekdayFormat: Format of weekday. Defaults to "eee" (eg. QUI.).
// - dayFormat: Format of day. Defaults to "dd/MM" (eg. 29/06).
// - spacing: Spacing between timezone blocks.
// - padding: Padding from the widget border.
// - bgColor: Background color for timezones without bgColor.
// - textColor: Text color.
// - widgetBgColor: Background color of the widget.
//
// Per timezone config:
// - bgColor: Background color for timezones
// - textColor: Text color

let countries = [
  { name: "🇧🇷", timeZone: "America/Sao_Paulo", config: { bgColor: new Color("009C3B", 1), textColor: Color.white() } },
  { name: "🇩🇰", timeZone: "CET", config: { bgColor: new Color("c8102e", 1), textColor: Color.white() } },
  { name: "🇮🇹", timeZone: "CET", config: { bgColor: new Color("008C45", 1), textColor: Color.white() } },
  { name: "🇬🇧", timeZone: "GMT", config: { bgColor: new Color("012169", 1), textColor: Color.white() } },
  { name: "🇺🇸", timeZone: "America/New_York", config: { bgColor: new Color("BF0D3E", 1), textColor: Color.white() } },
  { name: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", timeZone: "GMT", config: { bgColor: new Color("005EB8", 1), textColor: Color.white() } },
  { name: "🇦🇹", timeZone: "CET", config: { bgColor: new Color("ED2939", 1), textColor: Color.white() } },
  { name: "🇮🇪", timeZone: "Eire", config: { bgColor: new Color("FF8200", 1), textColor: Color.white() } }
];


let configOverride = {

};

// DO NOT EDIT BELLOW HERE

function createWidget(countries, widgetConfig) {
  let defaultConfig = {
    spacing: 5,
    padding: 5,
    bgColor: Color.dynamic(new Color("CCCCCC", 1), new Color("222222", 1)),
    textColor: Color.dynamic(new Color("222222", 1), new Color("FFFFFF", 1)),
    widgetBgColor: Color.dynamic(new Color("EEEEEE", 1), Color.black()),
    timeFormat: "H:mm",
    weekdayFormat: "eee",
    dayFormat: "dd/MM"
  };

  let currentConfig = { ...defaultConfig, ...widgetConfig }

  let widget = new ListWidget();
  widget.backgroundColor = currentConfig.widgetBgColor;
  let date = new Date();
  date.setTime(new Date().getTime() + 30000); // 30000ms = 1/2 second
  widget.refreshAfterDate = date;

  let maxItemsPerRow, maxItems;
  if (config.widgetFamily === "small" || args.widgetParameter === "small") {
    maxItemsPerRow = 2;
    maxItems = 2;
  } else if (config.widgetFamily === "large" || args.widgetParameter === "large") {
    maxItemsPerRow = 4;
    maxItems = 8;
  } else { // Medium
    maxItemsPerRow = 4;
    maxItems = 4;
  }

  let row = widget.addStack();
  widget.setPadding(currentConfig.padding, currentConfig.padding, currentConfig.padding, currentConfig.padding);

  let itemsCount = Math.min(maxItems, countries.length);
  for (let i = 0; i < itemsCount; i++) {
    if (i % maxItemsPerRow === 0) {
      row = widget.addStack();
    }
    addTimeZone(countries[i], row, currentConfig)
    if (i < itemsCount - 1 && i != maxItemsPerRow - 1) {
      row.addSpacer(currentConfig.spacing);
    }
    if (maxItems === 8 && i === maxItemsPerRow - 1 && itemsCount > maxItemsPerRow) {
      widget.addSpacer(currentConfig.spacing);
    }
  }
  return widget;
}

function currentDate(locale, timeZone) {
  return new Date(new Date().toLocaleString(locale, { timeZone: timeZone }));
}

function addTimeZone(country, r, currentConfig) {
  currentConfig = { ...currentConfig, ...country.config }

  let stack = r.addStack();
  stack.setPadding(0, 0, 0, 0);
  stack.spacing = 0;
  stack.layoutVertically();
  stack.backgroundColor = currentConfig.bgColor;
  stack.cornerRadius = 18;
  let titleStack = stack.addStack();
  titleStack.addSpacer();
  let title = titleStack.addText(country.name);
  title.textColor = currentConfig.textColor;
  title.font = Font.regularRoundedSystemFont(25);
  title.minimumScaleFactor = 0.1;
  title.lineLimit = 1;
  titleStack.backgroundColor = new Color("FFFFFF", 0.3);
  titleStack.addSpacer();
  stack.addSpacer();

  let formatterTime = new DateFormatter();
  formatterTime.dateFormat = currentConfig.timeFormat;

  let timeStack = stack.addStack();
  timeStack.addSpacer();

  let locale = Device.locale().replace("_", "-");
  let placeTime = currentDate(locale, country.timeZone);
  let time = timeStack.addDate(placeTime);
  time.applyTimeStyle();

  time.font = Font.boldRoundedSystemFont(33);
  time.minimumScaleFactor = 0.1;
  time.lineLimit = 1;
  time.textColor = currentConfig.textColor;
  timeStack.addSpacer();

  stack.addSpacer();

  let formatterDay = new DateFormatter();
  formatterDay.dateFormat = currentConfig.weekdayFormat;

  let dayStack = stack.addStack();
  dayStack.addSpacer();
  let day = dayStack.addText(formatterDay.string(placeTime).toLocaleUpperCase());
  day.font = Font.regularRoundedSystemFont(20);
  day.minimumScaleFactor = 0.1;
  day.lineLimit = 1;
  day.textColor = currentConfig.textColor;
  dayStack.addSpacer();

  let formatterDate = new DateFormatter();
  formatterDate.dateFormat = currentConfig.dayFormat;

  let dateStack = stack.addStack();
  dateStack.addSpacer();
  let date = dateStack.addText(formatterDate.string(placeTime));
  date.font = Font.regularRoundedSystemFont(20);
  date.minimumScaleFactor = 0.1;
  date.lineLimit = 1;
  date.textColor = currentConfig.textColor;
  dateStack.addSpacer();
  stack.addSpacer();
}

let widget = createWidget(countries, configOverride);
Script.setWidget(widget);

if (config.widgetFamily === "small" || args.widgetParameter === "small") {
  await widget.presentSmall();
} else if (config.widgetFamily === "large" || args.widgetParameter === "large") {
  await widget.presentLarge();
} else {
  await widget.presentMedium();
}

Script.complete();