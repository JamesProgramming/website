import { body, wantsReducedMotion, respondWidth } from "./variables";

if (window.innerWidth > respondWidth && !wantsReducedMotion) {
  // Create tooltip element
  let span = document.createElement("span");
  span.setAttribute("class", "tool-tip");

  // timeout for the wait time before displaying tool tip
  let timeOut;

  // Insert it into the body
  body.insertAdjacentElement("beforeend", span);

  // Loop through all elements that should have a custom tool tip
  Array.from(document.getElementsByClassName("has-tool-tip")).forEach((el) => {
    el.addEventListener("mouseover", (e) => {
      // Get position and dimension of element
      const currentElementInfo = el.getBoundingClientRect();
      // Get the title attribute text and add it to the tool tip element.
      el.setAttribute("data-title", el.getAttribute("title"));
      span.innerText = el.getAttribute("data-title");
      // Remove the title text so the browser does not show it
      el.setAttribute("title", "");

      // Get the tool tips new dimension
      const spanRect = span.getBoundingClientRect();

      // Check if tool tip should go on the left side of the element
      // (default is underneath element).
      if (
        currentElementInfo.left + spanRect.width / 2 + currentElementInfo.width / 2 + 20 >
        window.innerWidth
      ) {
        // Wait 1/2 seconds to add tool tip
        timeOut = setTimeout(() => {
          span.classList.remove("tool-tip--bottom", "tool-tip--side-right");
          span.classList.add("tool-tip--active", "tool-tip--side-left");
        }, 500);
        // currentElementInfoition to the left of element
        span.style.top = `${currentElementInfo.top - spanRect.height / 2 + currentElementInfo.height / 2}px`;
        span.style.left = `${currentElementInfo.left - spanRect.width}px`;
        return true;
      }

      // Check if tooltip will fit on right side of element
      if (currentElementInfo.left - spanRect.width / 2 + currentElementInfo.width / 2 - 20 < 0) {
        timeOut = setTimeout(() => {
          span.classList.remove("tool-tip--bottom", "tool-tip--side-left");
          span.classList.add("tool-tip--active", "tool-tip--side-right");
        }, 500);
        // currentElementInfoition to the right of element
        span.style.top = `${currentElementInfo.top - spanRect.height / 2 + currentElementInfo.height / 2}px`;
        span.style.left = `${currentElementInfo.right}px`;
        return true;
      }

      // Check if there is not enough room underneath element
      if (currentElementInfo.bottom + spanRect.height + 20 > window.innerHeight) {
        timeOut = setTimeout(() => {
          span.classList.add("tool-tip--active", "tool-tip--bottom");
        }, 500);
        // currentElementInfoition centered under element
        span.style.top = `${currentElementInfo.top - spanRect.height - 9}px`;
        span.style.left = `${currentElementInfo.left + currentElementInfo.width / 2 - spanRect.width / 2}px`;
        return true;
      }

      // Default currentElementInfoitioning centered under element
      timeOut = setTimeout(() => {
        span.classList.remove(
          "tool-tip--side-left",
          "tool-tip--bottom",
          "tool-tip--side-right"
        );
        span.classList.add("tool-tip--active");
      }, 500);

      span.style.top = `${currentElementInfo.bottom + 5}px`;
      span.style.left = `${currentElementInfo.left + currentElementInfo.width / 2 - spanRect.width / 2}px`;
    });

    el.addEventListener("mouseout", (e) => {
      // clear timeout to stop tool tip from appearing
      if (timeOut) clearTimeout(timeOut);
      timeOut = null;

      // Add back title attribute text
      el.setAttribute("title", el.getAttribute("data-title"));

      // Hide the tooltip
      span.classList.remove("tool-tip--active");
    });

    // Custom event fired off when page is scrolled.
    // Hides displaying custom tooltips.
    el.addEventListener("pageScrolling", () => {
      if (timeOut) clearTimeout(timeOut);
      span.classList.remove("tool-tip--active");
    });
  });
}
