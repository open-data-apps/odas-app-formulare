/*
 * Diese Funktion ist für die Inhalte der Startseite
 * zuständig.
 *
 */
let loadedData = null;

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeHttpUrl(value) {
  const s = String(value || "").trim();
  return /^https?:\/\//i.test(s) ? s : "";
}
let currentPage = 1;
let formDataStorage = {};
let foInstanzZaehler = 0;

async function app(configData, enclosingHtmlDivElement) {
  const foUid = "i" + ++foInstanzZaehler;
  const root = enclosingHtmlDivElement;
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
        <h1 id="fo-title-text-2" class="text-center">Formularauswahl</h1>
        <div id="fo-formListContainer" class="mt-4">
          <!-- Dynamische Liste oder Formularauswahl -->
        </div>
        <div id="fo-dynamicFormContainer" class="mt-4">
          <!-- Dynamische Inhalte des Formulars -->
        </div>
      </div>
    </div>
  </div><div id="fo-schale4" class="container"></div>`;

  var foSchale4 = root.querySelector("#fo-schale4");
  if (foSchale4) {
    foSchale4.innerHTML = methodikBox(configData, foUid) + renderWeitereInfos(configData, foUid);
  }

  const formListContainer = root.querySelector("#fo-formListContainer");
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
      <h5 class="form-label text-center">${escapeHtml(form.label)}</h5>
      <p class="form-description text-center">${escapeHtml(form.description)}</p>
    </div>`;

      listItem.addEventListener("click", () => loadDynamicForm(form));
      formList.appendChild(listItem);
    });

    formListContainer.appendChild(formList);
  }

  function loadDynamicForm(form) {
    root.querySelector("#fo-title-text-2").textContent = form.label;
    const formContainer = root.querySelector("#fo-dynamicFormContainer");
    const formListContainer = root.querySelector("#fo-formListContainer");
    formListContainer.style.display = "none";

    let currentPage = 1;

    function renderPage(page) {
      formContainer.innerHTML = "";
      const pageData = form.pages.find((p) => p.page === page);
      if (!pageData) return;

      let descriptionHTML = `<div class="row"><div class="col-sm-12 text-center"><p class="form-label-style">${escapeHtml(pageData.title)}: ${escapeHtml(pageData.description)}</p></div></div>`;
      let formHTML = `<form id="${escapeHtml(form.id)}" class="form-horizontal">`;
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
                  `<li class="list-group-item"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</li>`
              )
              .join("")}</ul></div>`;
          }
          formHTML += `<div class="form-group"><div class="form-check"><input type="checkbox" class="form-check-input" id="consentCheckbox" required><label class="form-check-label" for="consentCheckbox">${escapeHtml(pageData.consentForm)}</label></div></div>`;
          if (pageData.emailcopy === "ja") {
            formHTML += `<div class="form-group"><div class="form-check"><input type="checkbox" class="form-check-input" id="fo-emailCopyCheckbox"><label class="form-check-label" for="fo-emailCopyCheckbox">Ich möchte eine Kopie per E-Mail erhalten</label></div><div id="emailInputContainer" style="margin-top: 10px;"><label for="fo-emailAddress" class="form-label">E-Mail-Adresse</label><input type="email" class="form-control" id="fo-emailAddress" name="emailAddress" placeholder="Ihre E-Mail-Adresse" required></div></div>`;
          }
          break;
        default:
          console.warn(`Unbekannter Seitentyp: ${pageData.type}`);
          break;
      }

      formHTML += `<div class="form-group row"><div class="col-sm-4 text-left"><button type="button" id="fo-backToFormsButton" class="btn btn-secondary btn-sm">abbrechen</button></div><div class="col-sm-4 text-center">${
        page > 1
          ? `<button type="button" id="fo-prevButton" class="btn btn-primary">zurück</button>`
          : ""
      }</div><div class="col-sm-4 text-right">${
        page < getMaxPage(form.pages)
          ? `<button type="button" id="fo-nextButton" class="btn btn-primary btn-lg">weiter</button>`
          : `<button type="submit" id="fo-submitButton" class="btn btn-primary btn-lg">Absenden</button>`
      }</div></div><div id="fo-submit-status" class="mt-3"></div></form>`;

      formContainer.innerHTML = descriptionHTML + formHTML;

      if (page > 1) {
        root.querySelector("#fo-prevButton").addEventListener("click", () => {
          saveCurrentPageData(currentPage, form, root);
          currentPage--;
          renderPage(currentPage);
        });
      }

      if (page < getMaxPage(form.pages)) {
        root.querySelector("#fo-nextButton").addEventListener("click", () => {
          if (validatePage(currentPage, form)) {
            saveCurrentPageData(currentPage, form, root);
            currentPage++;
            renderPage(currentPage);
          }
        });
      } else {
        root
          .querySelector("#fo-submitButton")
          .addEventListener("click", async (e) => {
            e.preventDefault();
            if (validatePage(currentPage, form)) {
              saveCurrentPageData(currentPage, form, root);
              const dataObj = collectFormData(form);
              const summary = Object.entries(dataObj)
                .map(([k, v]) => `${k}: ${v}`)
                .join("\n");
              // Endpunkt aus dem App-Basispfad bilden, nicht aus window.location.href:
              // die Base-Runtime setzt immer einen Hash, der sonst in der URL landet.
              const mailUrl = `${getOdasAppBasePath()}/mail`;
              // Payload nur mit emailCC wenn Option angekreuzt
              const payload = { content: summary };
              const copyCheckbox = root.querySelector("#fo-emailCopyCheckbox");
              if (copyCheckbox && copyCheckbox.checked) {
                const email =
                  root.querySelector("#fo-emailAddress")?.value || "";
                payload.emailCC = email;
              }

              const submitButton = root.querySelector("#fo-submitButton");
              const statusContainer =
                root.querySelector("#fo-submit-status");
              if (statusContainer) statusContainer.innerHTML = "";
              if (submitButton) submitButton.disabled = true;

              try {
                const response = await fetch(mailUrl, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                });
                if (!response.ok) {
                  throw new Error(`HTTP ${response.status}`);
                }
                confirmationpage(enclosingHtmlDivElement);
              } catch (err) {
                console.error("Mail senden fehlgeschlagen", err);
                if (statusContainer) {
                  statusContainer.innerHTML =
                    '<div class="alert alert-danger" role="alert">Das Formular konnte nicht übermittelt werden. Bitte versuchen Sie es später erneut. Ihre Eingaben bleiben erhalten.</div>';
                }
                if (submitButton) submitButton.disabled = false;
              }
            }
          });
      }

      root
        .querySelector("#fo-backToFormsButton")
        .addEventListener("click", () => {
          formContainer.innerHTML = "";
          formListContainer.style.display = "block";
          root.querySelector("#fo-title-text-2").textContent =
            "Formularauswahl";
        });
    }

    renderPage(currentPage);
    loadPageDataIntoFields(currentPage, form, root);
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
        const radioYes = root.querySelector("#" + field.id + "_ja");
        const radioNo = root.querySelector("#" + field.id + "_nein");
        const errorElement = root.querySelector("#" + field.id + "-error");
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
      const fieldElement = root.querySelector("#" + field.id);
      const errorElement = root.querySelector("#" + field.id + "-error");
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
        <label for="${escapeHtml(field.id)}" class="col-sm-5 col-form-label">${
          escapeHtml(field.label)
        }:</label>
        <div class="col-sm-7">
          <input type="${escapeHtml(field.type)}" id="${escapeHtml(field.id)}" name="${
          escapeHtml(field.name)
        }" class="form-control"
            ${field.required ? "required" : ""} ${
          field.maxLength ? `maxlength="${escapeHtml(field.maxLength)}"` : ""
        }>
        </div>
      </div>`;
      case "dropdown":
        let options = "";
        if (field.options && Array.isArray(field.options)) {
          field.options.forEach((option) => {
            options += `<option value="${escapeHtml(option.value ?? option.label)}">${escapeHtml(option.label)}</option>`;
          });
        }
        return `
      <div class="form-group row">
        <label for="${escapeHtml(field.id)}" class="col-sm-5 col-form-label">${
          escapeHtml(field.label)
        }:</label>
        <div class="col-sm-7">
          <select id="${escapeHtml(field.id)}" name="${escapeHtml(field.name)}" class="form-select" ${
          field.required ? "required" : ""
        }>
            ${options}
          </select>
        </div>
      </div>`;
      case "ja-nein":
        return `
      <div class="form-group row">
        <label class="col-sm-5 col-form-label">${escapeHtml(field.label)}:</label>
        <div class="col-sm-7">
          <div class="form-check form-check-inline" style="margin-right:0.3rem;">
            <input class="form-check-input" type="radio" name="${
              escapeHtml(field.name)
            }" id="${escapeHtml(field.id)}_ja" value="Ja" ${
          field.required ? "required" : ""
        }>
            <label class="form-check-label" for="${escapeHtml(field.id)}_ja">Ja</label>
          </div>
          <div class="form-check form-check-inline" style="margin-right:0.3rem;">
            <input class="form-check-input" type="radio" name="${
              escapeHtml(field.name)
            }" id="${escapeHtml(field.id)}_nein" value="Nein" ${
          field.required ? "required" : ""
        }>
            <label class="form-check-label" for="${escapeHtml(field.id)}_nein">Nein</label>
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
                <input class="form-check-input me-2" type="checkbox" id="${escapeHtml(field.id)}_${index}" name="${escapeHtml(field.name)}" value="${escapeHtml(optionLabel)}">
                <span>${escapeHtml(optionLabel)}</span>
              </label>`;
          });
        }
        return `
      <div class="form-group row">
        <label class="col-sm-5 col-form-label">${escapeHtml(field.label)}:</label>
        <div class="col-sm-7">
          <div class="list-group" id="${escapeHtml(field.id)}-list">
            ${listItems}
          </div>
        </div>
      </div>`;
      default:
        return '<div class="alert alert-warning">Unbekannter Feldtyp "' + escapeHtml(String(field.typ || "")) + '" wird übersprungen.</div>';
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
            <button type="button" id="fo-backToFormSelectionButton" class="btn btn-primary">Zurück zur Formularauswahl</button>
          </div>
        </div>
      </div>
    </div>
  `;
  enclosingHtmlDivElement
    .querySelector("#fo-backToFormSelectionButton")
    .addEventListener("click", () => {
      loadPage("startseite");
    });
}

// Hilfsfunktion: Nur Pfad aus vollständiger URL extrahieren
function isOdasProxyEnabled(configdata = {}) {
  return String(configdata.proxyAktiv || "").trim().toLowerCase() === "ja";
}

function extractPathFromUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname + parsedUrl.search;
  } catch (_error) {
    return String(url || "");
  }
}

function getOdasAppBasePath(pathname) {
  let appPath =
    pathname === undefined
      ? typeof window !== "undefined"
        ? window.location.pathname
        : "/"
      : String(pathname || "/");

  if (!appPath.endsWith("/")) {
    const lastSlashIndex = appPath.lastIndexOf("/");
    const lastSegment = appPath.substring(lastSlashIndex + 1);
    if (lastSegment.includes(".")) {
      appPath = appPath.substring(0, lastSlashIndex + 1);
    }
  }

  return appPath.replace(/\/+$/, "");
}

function getOdasProxyEndpoint(targetUrl, pathname) {
  const appPath = getOdasAppBasePath(pathname);
  return `${appPath}/odp-data?path=${encodeURIComponent(
    extractPathFromUrl(targetUrl),
  )}`;
}

async function fetchViaOdasProxy(targetUrl) {
  const response = await fetch(getOdasProxyEndpoint(targetUrl), {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`ODAS-Proxy-Fehler: HTTP ${response.status}`);
  }

  const proxyData = await response.json();
  if (!proxyData || typeof proxyData.content !== "string") {
    throw new Error("ODAS-Proxy-Antwort enthält keinen content-String.");
  }

  return proxyData.content;
}

async function fetchOdasResource(targetUrl, configdata = {}) {
  if (isOdasProxyEnabled(configdata)) {
    return fetchViaOdasProxy(targetUrl);
  }

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.text();
  } catch (error) {
    throw new Error(
      `Direkter Datenabruf fehlgeschlagen (${error.message}). Bitte prüfen Sie die Daten-URL und die CORS-Freigabe der Datenquelle.`,
    );
  }
}

async function fetchOdasJson(targetUrl, configdata = {}) {
  return JSON.parse(await fetchOdasResource(targetUrl, configdata));
}

async function LoadJSONData() {
  try {
    const data = await fetchOdasJson(configData.apiurl, configData);

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
              id: "fo-" + field.name, // DOM- und Speicher-ID, mit App-Präfix (F-25); Submit-Payload nutzt field.label
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

function saveCurrentPageData(page, form, root) {
  if (!formDataStorage[form.id]) {
    formDataStorage[form.id] = {};
  }
  if (!formDataStorage[form.id][page]) {
    formDataStorage[form.id][page] = {};
  }

  const pageData = form.pages.find((p) => p.page === page);
  if (!pageData) return;

  pageData.fields.forEach((field) => {
    const fieldElement = root.querySelector("#" + field.id);
    if (fieldElement) {
      formDataStorage[form.id][page][field.id] =
        fieldElement.type === "checkbox"
          ? fieldElement.checked
          : fieldElement.value;
    }
  });
}

function loadPageDataIntoFields(page, form, root) {
  if (!formDataStorage[form.id] || !formDataStorage[form.id][page]) return;

  const pageData = form.pages.find((p) => p.page === page);
  if (!pageData) return;

  pageData.fields.forEach((field) => {
    const fieldElement = root.querySelector("#" + field.id);
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

function methodikBox(configdata, uid) {
  var hinweis = String(configdata.datenquelleHinweis || "").trim();
  var stand = String(configdata.datenStand || "").trim();
  if (!hinweis && !stand) return "";
  var standZeile = stand
    ? '<p class="text-muted small mb-2">' + escapeHtml(stand) + "</p>"
    : "";
  return (
    '<section class="fo-methodik mt-4">' +
    '<button class="fo-methodik-toggle collapsed" type="button" ' +
    'data-bs-toggle="collapse" data-bs-target="#fo-methodik-body-' + uid + '" ' +
    'aria-expanded="false" aria-controls="fo-methodik-body-' + uid + '">' +
    '<h2 class="h5 mb-0">Methodik &amp; Datenquelle</h2>' +
    '<span class="fo-methodik-chevron" aria-hidden="true">&#9662;</span>' +
    "</button>" +
    '<div id="fo-methodik-body-' + uid + '" class="collapse">' +
    '<div class="fo-methodik-content">' +
    standZeile +
    hinweis +
    "</div></div></section>"
  );
}

function renderWeitereInfos(configdata, uid) {
  var links = (configdata.weiterfuehrendeLinks || "").trim();
  if (!links) return "";
  return (
    '<section class="fo-weitere-infos mt-4">' +
    '<button class="fo-weitere-infos-toggle collapsed" type="button" ' +
    'data-bs-toggle="collapse" data-bs-target="#fo-weitere-infos-body-' + uid + '" ' +
    'aria-expanded="false" aria-controls="fo-weitere-infos-body-' + uid + '">' +
    '<h2 class="h5 mb-0">Weitere Informationen</h2>' +
    '<span class="fo-weitere-infos-chevron" aria-hidden="true">&#9662;</span>' +
    "</button>" +
    '<div id="fo-weitere-infos-body-' + uid + '" class="collapse">' +
    '<div class="fo-weitere-infos-content">' +
    links +
    "</div></div></section>"
  );
}

/*
 * Diese Funktion kann Bibliotheken und benötigte Skripte laden.
 */
function addToHead() {}
