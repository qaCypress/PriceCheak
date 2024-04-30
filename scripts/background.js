chrome.runtime.onInstalled.addListener(() => {
  // Устанавливаем обработчик события изменения фокуса окна браузера
  chrome.windows.onFocusChanged.addListener((windowId) => {
    // Получаем информацию о текущем окне
    chrome.windows.getCurrent({}, (window) => {
      // Если окно, потерявшее фокус, не является окном расширения, активируем его
      if (windowId !== chrome.windows.WINDOW_ID_NONE && window.type !== "extension") {
        chrome.windows.update(windowId, { focused: true });
      }
    });
  });
});