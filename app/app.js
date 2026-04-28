/*
 * Diese Funktion ist für die Inhalte der Startseite
 * zuständig.
 *
 */
let loadedData = null;
let currentPage = 1;
let formDataStorage = {};

async function app(configData, enclosingHtmlDivElement) {
  await LoadJSONData();
  document.body.classList.remove("register-page");

  if (!loadedData || !loadedData.forms) {
    console.error("Keine Daten verfügbar");
    enclosingHtmlDivElement.innerHTML = `<p>Fehler beim Laden der Formulare.</p>`;
    return;
  }

  enclosingHtmlDivElement.innerHTML = `<div class="container">
    <div class="row justify-content-center">
      <div class="col-12" id="secondarySites">
        <h1 id="title-text-2" class="text-center">Formularauswahl</h1>
        <div id="formListContainer" class="mt-4">
          <!-- Dynamische Liste oder Formularauswahl -->
        </div>
        <div id="dynamicFormContainer" class="mt-4">
          <!-- Dynamische Inhalte des Formulars -->
        </div>
      </div>
    </div>
  </div>`;

  const formListContainer = document.getElementById("formListContainer");
  const urlString = window.location.href;
  const url = new URL(urlString);
  const formParam = url.searchParams.get("form");

  if (formParam) {
    const selectedForm = loadedData.forms.find((form) => form.id === formParam);
    if (selectedForm) {
      loadDynamicForm(selectedForm);
    }
  }

  if (loadedData.forms.length === 1) {
    loadDynamicForm(loadedData.forms[0]);
  } else {
    const formList = document.createElement("ul");
    formList.className = "list-group";

    loadedData.forms.forEach((form) => {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item list-group-item-action";
      listItem.innerHTML = `
    <div class="form-item">
      <h5 class="form-label text-center">${form.label}</h5>
      <p class="form-description text-center">${form.description}</p>
    </div>`;

      listItem.addEventListener("click", () => loadDynamicForm(form));
      formList.appendChild(listItem);
    });

    formListContainer.appendChild(formList);
  }

  function loadDynamicForm(form) {
    document.getElementById("title-text-2").textContent = form.label;
    const formContainer = document.getElementById("dynamicFormContainer");
    const formListContainer = document.getElementById("formListContainer");
    formListContainer.style.display = "none";

    let currentPage = 1;

    function renderPage(page) {
      formContainer.innerHTML = "";
      const pageData = form.pages.find((p) => p.page === page);
      if (!pageData) return;

      let descriptionHTML = `<div class="row"><div class="col-sm-12 text-center"><p class="form-label-style">${pageData.title}: ${pageData.description}</p></div></div>`;
      let formHTML = `<form id="${form.id}" class="form-horizontal">`;

      switch (pageData.type) {
        case "textformular":
        case "customformular":
          pageData.fields.forEach((field) => {
            formHTML += generateFieldHTML(field);
          });
          break;
        case "bestaetigungsformular":
          if (pageData.summary === "ja") {
            const formData = collectFormData(form);
            formHTML += `<div class="summary-container mt-4"><ul class="list-group">${Object.entries(
              formData
            )
              .map(
                ([label, value]) =>
                  `<li class="list-group-item"><strong>${label}:</strong> ${value}</li>`
              )
              .join("")}</ul></div>`;
          }
          formHTML += `<div class="form-group"><div class="form-check"><input type="checkbox" class="form-check-input" id="consentCheckbox" required><label class="form-check-label" for="consentCheckbox">${pageData.consentForm}</label></div></div>`;
          if (pageData.emailcopy === "ja") {
            formHTML += `<div class="form-group"><div class="form-check"><input type="checkbox" class="form-check-input" id="emailCopyCheckbox"><label class="form-check-label" for="emailCopyCheckbox">Ich möchte eine Kopie per E-Mail erhalten</label></div><div id="emailInputContainer" style="margin-top: 10px;"><label for="emailAddress" class="form-label">E-Mail-Adresse</label><input type="email" class="form-control" id="emailAddress" name="emailAddress" placeholder="Ihre E-Mail-Adresse" required></div></div>`;
          }
          break;
        default:
          console.warn(`Unbekannter Seitentyp: ${pageData.type}`);
          break;
      }

      formHTML += `<div class="form-group row"><div class="col-sm-4 text-left"><button type="button" id="backToFormsButton" class="btn btn-secondary btn-sm">abbrechen</button></div><div class="col-sm-4 text-center">${
        page > 1
          ? `<button type="button" id="prevButton" class="btn btn-primary">zurück</button>`
          : ""
      }</div><div class="col-sm-4 text-right">${
        page < getMaxPage(form.pages)
          ? `<button type="button" id="nextButton" class="btn btn-primary btn-lg">weiter</button>`
          : `<button type="submit" id="submitButton" class="btn btn-primary btn-lg">Absenden</button>`
      }</div></div></form>`;

      formContainer.innerHTML = descriptionHTML + formHTML;

      if (page > 1) {
        document.getElementById("prevButton").addEventListener("click", () => {
          saveCurrentPageData(currentPage, form);
          currentPage--;
          renderPage(currentPage);
        });
      }

      if (page < getMaxPage(form.pages)) {
        document.getElementById("nextButton").addEventListener("click", () => {
          if (validatePage(currentPage, form)) {
            saveCurrentPageData(currentPage, form);
            currentPage++;
            renderPage(currentPage);
          }
        });
      } else {
        document
          .getElementById("submitButton")
          .addEventListener("click", async (e) => {
            e.preventDefault();
            if (validatePage(currentPage, form)) {
              saveCurrentPageData(currentPage, form);
              const dataObj = collectFormData(form);
              const summary = Object.entries(dataObj)
                .map(([k, v]) => `${k}: ${v}`)
                .join("\n");
              const urlString = window.location.href;
              const mailUrl = `${urlString}mail`;
              // Payload nur mit emailCC wenn Option angekreuzt
              const payload = { content: summary };
              const copyCheckbox = document.getElementById("emailCopyCheckbox");
              if (copyCheckbox && copyCheckbox.checked) {
                const email =
                  document.getElementById("emailAddress")?.value || "";
                payload.emailCC = email;
              }
              try {
                await fetch(mailUrl, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                });
              } catch (err) {
                console.error("Mail senden fehlgeschlagen", err);
              }
              confirmationpage(enclosingHtmlDivElement);
            }
          });
      }

      document
        .getElementById("backToFormsButton")
        .addEventListener("click", () => {
          formContainer.innerHTML = "";
          formListContainer.style.display = "block";
          document.getElementById("title-text-2").textContent =
            "Formularauswahl";
        });
    }

    renderPage(currentPage);
    loadPageDataIntoFields(currentPage, form);
  }

  function getMaxPage(pages) {
    return Math.max(...pages.map((p) => p.page));
  }

  // Angepasste Validierung, die "ja-nein"-Felder separat behandelt
  function validatePage(page, form) {
    const pageData = form.pages.find((p) => p.page === page);
    const fieldsForPage = pageData ? pageData.fields : [];
    let valid = true;

    fieldsForPage.forEach((field) => {
      // Spezielle Behandlung für "ja-nein"-Felder, da hier zwei Radio-Buttons verwendet werden
      if (field.type === "ja-nein") {
        const radioYes = document.getElementById(field.id + "_ja");
        const radioNo = document.getElementById(field.id + "_nein");
        const errorElement = document.getElementById(field.id + "-error");
        if (field.required && !radioYes.checked && !radioNo.checked) {
          if (!errorElement) {
            const errorMsg = document.createElement("div");
            errorMsg.id = field.id + "-error";
            errorMsg.className = "invalid-feedback d-block";
            errorMsg.textContent = "Dieses Feld ist erforderlich.";
            radioNo.parentNode.appendChild(errorMsg);
          }
          valid = false;
        } else if (errorElement) {
          errorElement.remove();
        }
        return; // Validierung für dieses Feld abgeschlossen
      }

      // Für alle anderen Feldtypen
      const fieldElement = document.getElementById(field.id);
      const errorElement = document.getElementById(field.id + "-error");
      if (field.required && fieldElement && !fieldElement.value.trim()) {
        fieldElement.classList.add("is-invalid");
        if (!errorElement) {
          const errorMsg = document.createElement("div");
          errorMsg.id = field.id + "-error";
          errorMsg.className = "invalid-feedback";
          errorMsg.textContent = "Dieses Feld ist erforderlich.";
          fieldElement.parentNode.appendChild(errorMsg);
        }
        valid = false;
      } else if (fieldElement) {
        fieldElement.classList.remove("is-invalid");
        if (errorElement) {
          errorElement.remove();
        }
      }
    });

    return valid;
  }

  function collectFormData(form) {
    const data = {};

    if (!formDataStorage[form.id]) return data;

    Object.entries(formDataStorage[form.id]).forEach(([page, fields]) => {
      Object.entries(fields).forEach(([fieldId, value]) => {
        const field = form.pages
          .flatMap((p) => p.fields)
          .find((f) => f.id === fieldId);

        if (field) {
          data[field.label] = value !== "" ? value : "Keine Eingabe";
        }
      });
    });

    return data;
  }

  // HTML für Felder generieren
  function generateFieldHTML(field) {
    switch (field.type) {
      case "text":
      case "zahl":
      case "email":
        return `
      <div class="form-group row">
        <label for="${field.id}" class="col-sm-5 col-form-label">${
          field.label
        }:</label>
        <div class="col-sm-7">
          <input type="${field.type}" id="${field.id}" name="${
          field.name
        }" class="form-control"
            ${field.required ? "required" : ""} ${
          field.maxLength ? `maxlength="${field.maxLength}"` : ""
        }>
        </div>
      </div>`;
      case "dropdown":
        let options = "";
        if (field.options && Array.isArray(field.options)) {
          field.options.forEach((option) => {
            options += `<option value="${option.value}">${option.label}</option>`;
          });
        }
        return `
      <div class="form-group row">
        <label for="${field.id}" class="col-sm-5 col-form-label">${
          field.label
        }:</label>
        <div class="col-sm-7">
          <select id="${field.id}" name="${field.name}" class="form-select" ${
          field.required ? "required" : ""
        }>
            ${options}
          </select>
        </div>
      </div>`;
      case "ja-nein":
        return `
      <div class="form-group row">
        <label class="col-sm-5 col-form-label">${field.label}:</label>
        <div class="col-sm-7">
          <div class="form-check form-check-inline" style="margin-right:0.3rem;">
            <input class="form-check-input" type="radio" name="${
              field.name
            }" id="${field.id}_ja" value="Ja" ${
          field.required ? "required" : ""
        }>
            <label class="form-check-label" for="${field.id}_ja">Ja</label>
          </div>
          <div class="form-check form-check-inline" style="margin-right:0.3rem;">
            <input class="form-check-input" type="radio" name="${
              field.name
            }" id="${field.id}_nein" value="Nein" ${
          field.required ? "required" : ""
        }>
            <label class="form-check-label" for="${field.id}_nein">Nein</label>
          </div>
        </div>
      </div>`;
      case "multiselect":
        let listItems = "";
        if (field.options && Array.isArray(field.options)) {
          field.options.forEach((option, index) => {
            // Ermittle den anzuzeigenden Wert: Falls option ein Objekt ist, wird option.label genutzt, sonst der direkte Wert.
            const optionLabel =
              typeof option === "string" ? option : option.label;
            listItems += `
              <label class="list-group-item list-group-item-action d-flex align-items-center" style="padding: 0.2rem 0.4rem; font-size: 1rem; line-height: 1;">
                <input class="form-check-input me-2" type="checkbox" id="${field.id}_${index}" name="${field.name}" value="${optionLabel}">
                <span>${optionLabel}</span>
              </label>`;
          });
        }
        return `
      <div class="form-group row">
        <label class="col-sm-5 col-form-label">${field.label}:</label>
        <div class="col-sm-7">
          <div class="list-group" id="${field.id}-list">
            ${listItems}
          </div>
        </div>
      </div>`;
      default:
        return `
      <div class="form-group row">
        <label for="${field.id}" class="col-sm-5 col-form-label">${
          field.label
        }:</label>
        <div class="col-sm-7">
          <input type="text" id="${field.id}" name="${
          field.name
        }" class="form-control" ${field.required ? "required" : ""}>
        </div>
      </div>`;
    }
  }
}

function confirmationpage(enclosingHtmlDivElement) {
  const now = new Date();
  const dateString = now.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeString = now.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
  enclosingHtmlDivElement.innerHTML = `
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12">
          <h1 class="text-center">Vielen Dank!</h1>
          <p class="text-center">Das Formular wurde erfolgreich übermittelt am ${dateString} um ${timeString} Uhr. Sie können dieses Fenster jetzt schließen.</p>
          <div class="text-center mt-4">
            <h5>Weitere Formulare ausfüllen?</h5>
            <button type="button" id="backToFormSelectionButton" class="btn btn-primary">Zurück zur Formularauswahl</button>
          </div>
        </div>
      </div>
    </div>
  `;
  document
    .getElementById("backToFormSelectionButton")
    .addEventListener("click", () => {
      loadPage("startseite");
    });
}

// Hilfsfunktion: Nur Pfad aus vollständiger URL extrahieren
function extractPathFromUrl(url) {
  try {
    const u = new URL(url);
    return u.pathname + u.search;
  } catch (e) {
    return url;
  }
}

async function LoadJSONData() {
  // Aktuellen Pfad extrahieren, z. B. /view/odpname/appname/instanzid
  const fullPath = window.location.pathname.replace(/\/+$/, "");

  // Proxy-Endpunkt zusammensetzen
  const proxyEndpoint = `${fullPath}/odp-data?path=${extractPathFromUrl(
    configData.apiurl
  )}`;

  try {
    const response = await fetch(proxyEndpoint, { method: "POST" });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const proxyData = await response.json();
    let data;
    try {
      data = JSON.parse(proxyData.content);
    } catch (e) {
      loadedData = null;
      return;
    }

    // Speicherung in der globalen Variable – Hier werden Feldtypen umgewandelt:
    loadedData = {
      forms: data.forms.map((form) => ({
        id: form.id,
        label: form.label,
        title: form.titel || "",
        description: form.beschreibung || "",
        pages: Object.entries(form.pages).map(([pageNumber, pageData]) => ({
          page: parseInt(pageNumber, 10),
          type: pageData.typ,
          title: pageData.titel || "",
          description: pageData.beschreibung || "",
          summary: pageData.zusammenfassung || "",
          consentForm: pageData.einverständniserklärung || "",
          emailcopy: pageData.emailkopie || "",
          fields:
            pageData.fields?.map((field) => ({
              id: field.name, // Sollte ggf. entfernt werden, falls nicht benötigt
              name: field.name,
              label: field.label,
              required: field.pflichtfeld === "ja",
              // Hier erfolgt die Umwandlung der Typen:
              type:
                field.typ === "ja/nein"
                  ? "ja-nein"
                  : field.typ === "auswahlliste"
                  ? "multiselect"
                  : field.typ,
              maxLength: field.länge || null,
              options: field.options || null,
            })) || [],
        })),
      })),
    };
  } catch (error) {
    console.error("Fehler beim Laden der Daten:", error);
    loadedData = null;
  }
}

function saveCurrentPageData(page, form) {
  if (!formDataStorage[form.id]) {
    formDataStorage[form.id] = {};
  }
  if (!formDataStorage[form.id][page]) {
    formDataStorage[form.id][page] = {};
  }

  const pageData = form.pages.find((p) => p.page === page);
  if (!pageData) return;

  pageData.fields.forEach((field) => {
    const fieldElement = document.getElementById(field.id);
    if (fieldElement) {
      formDataStorage[form.id][page][field.id] =
        fieldElement.type === "checkbox"
          ? fieldElement.checked
          : fieldElement.value;
    }
  });
}

function loadPageDataIntoFields(page, form) {
  if (!formDataStorage[form.id] || !formDataStorage[form.id][page]) return;

  const pageData = form.pages.find((p) => p.page === page);
  if (!pageData) return;

  pageData.fields.forEach((field) => {
    const fieldElement = document.getElementById(field.id);
    if (
      fieldElement &&
      formDataStorage[form.id][page][field.id] !== undefined
    ) {
      fieldElement.value = formDataStorage[form.id][page][field.id];
      if (fieldElement.type === "checkbox") {
        fieldElement.checked =
          formDataStorage[form.id][page][field.id] === "Ja";
      }
    }
  });
}

/*
 * Diese Funktion kann Bibliotheken und benötigte Skripte laden.
 */
function addToHead() {}
