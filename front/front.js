const API_BASE = "http://localhost:3000";
const tokenKey = "gsb_token";

let currentPage = 1;
let totalPages = 1;
let currentSearch = "";

async function loginRequest(login, password) {
    const response = await fetch(`${API_BASE}/connexion`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ login, password })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Erreur de connexion");
    }

    return data.data;
}

async function fetchMedecins(page = 1, search = "") {
    const token = localStorage.getItem(tokenKey);

    const url = new URL(`${API_BASE}/medecins`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("element", "20");

    if (search.trim()) {
        url.searchParams.set("name", search.trim());
    }

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Erreur lors du chargement des médecins");
    }

    return data;
}

async function fetchDoctorById(id) {
    const token = localStorage.getItem(tokenKey);

    const response = await fetch(`${API_BASE}/medecins/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Erreur lors du chargement du médecin");
    }

    return data;
}

async function fetchReports(page = 1) {
    const token = localStorage.getItem(tokenKey);

    const url = new URL(`${API_BASE}/rapports`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("element", "20");

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Erreur lors du chargement des rapports");
    }

    return data;
}

async function fetchReportById(id) {
    const token = localStorage.getItem(tokenKey);

    const response = await fetch(`${API_BASE}/rapports/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const text = await response.text();
    console.log("fetchReportById raw =", text);

    try {
        const data = JSON.parse(text);

        if (!response.ok) {
            throw new Error(data.error || "Erreur lors du chargement du rapport");
        }

        return data;
    } catch {
        throw new Error("La route détail rapport ne renvoie pas du JSON.");
    }
}

async function createReport(reportPayload) {
    const token = localStorage.getItem(tokenKey);

    const response = await fetch(`${API_BASE}/rapports`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reportPayload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || data.data || "Erreur lors de la création du rapport");
    }

    return data;
}

async function updateReport(reportId, reportPayload) {
    const token = localStorage.getItem(tokenKey);

    const response = await fetch(`${API_BASE}/rapports/${reportId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reportPayload)
    });

    const text = await response.text();
    console.log("updateReport raw =", text);

    try {
        const data = JSON.parse(text);

        if (!response.ok) {
            throw new Error(data.error || data.data || "Erreur lors de la modification du rapport");
        }

        return data;
    } catch {
        throw new Error("La route de modification du rapport ne renvoie pas du JSON.");
    }
}

function renderMedecins(data) {
    const container = document.getElementById("medecinsList");
    container.innerHTML = "";

    const medecins = Array.isArray(data.doctors) ? data.doctors : [];

    if (!medecins.length) {
        container.innerHTML = "<p>Aucun médecin trouvé.</p>";
        return;
    }

    medecins.forEach((medecin) => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${medecin.lastname || ""} ${medecin.firstname || ""}</h3>
            <p class="muted">ID : ${medecin.id || "-"}</p>
            <p><strong>Adresse :</strong> ${medecin.address || "-"}</p>
            <p><strong>Téléphone :</strong> ${medecin.phone || "-"}</p>
            <p><strong>Spécialité :</strong> ${medecin.speciality || "-"}</p>
            <p style="margin-top:12px;">
                <a href="medecin.html?id=${medecin.id}">Voir le détail</a>
            </p>
        `;

        container.appendChild(card);
    });
}

function renderPagination() {
    const pageInfo = document.getElementById("pageInfo");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (!pageInfo || !prevBtn || !nextBtn) return;

    pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
}

async function loadMedecins(page = 1, search = "") {
    const errorEl = document.getElementById("error");
    errorEl.textContent = "";

    try {
        const data = await fetchMedecins(page, search);

        currentPage = Number(data.currentPage || 1);
        totalPages = Number(data.totalPages || 1);
        currentSearch = search;

        renderMedecins(data);
        renderPagination();
    } catch (error) {
        errorEl.textContent = error.message;
    }
}

function logoutFrontendOnly() {
    localStorage.removeItem(tokenKey);
    window.location.href = "index.html";
}

function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

function renderDoctor(data) {
    const container = document.getElementById("doctorCard");

    const doctor =
        data.doctor ||
        data.medecin ||
        data.data?.doctor ||
        data.data?.medecin ||
        data.data ||
        data;

    const lastname = doctor.lastname || doctor.nom || "-";
    const firstname = doctor.firstname || doctor.prenom || "-";
    const address = doctor.address || doctor.adresse || "-";
    const phone = doctor.phone || doctor.tel || "-";
    const speciality = doctor.speciality || doctor.specialitecomplementaire || "-";

    container.innerHTML = `
        <h1>${lastname} ${firstname}</h1>
        <p><strong>ID :</strong> ${doctor.id || "-"}</p>
        <p><strong>Adresse :</strong> ${address}</p>
        <p><strong>Téléphone :</strong> ${phone}</p>
        <p><strong>Spécialité :</strong> ${speciality}</p>
    `;
}

function renderDoctorReports(data) {
    const container = document.getElementById("reportsList");
    container.innerHTML = "";

    const reports =
        data.reports ||
        data.reportList ||
        data.rapports ||
        data.data?.reports ||
        data.data?.reportList ||
        [];

    if (!reports.length) {
        container.innerHTML = "<p>Aucun rapport trouvé pour ce médecin.</p>";
        return;
    }

    reports.forEach((report) => {
        const div = document.createElement("div");
        div.className = "report";

        const date = report.date || report.reportDate || "-";
        const motive = report.motive || report.motif || report.reason || "-";
        const balanceSheet =
            report["balance sheet"] ||
            report.balanceSheet ||
            report.bilan ||
            "-";

        div.innerHTML = `
            <p><strong>Date :</strong> ${date}</p>
            <p><strong>Motif :</strong> ${motive}</p>
            <p><strong>Bilan :</strong> ${balanceSheet}</p>
        `;

        container.appendChild(div);
    });
}

function renderReportsPage(data, selectedDate = "") {
    const container = document.getElementById("reportsPageList");
    container.innerHTML = "";

    let reports = Array.isArray(data) ? data : [];
    reports = reports.filter((item) => typeof item === "object" && item !== null && "id" in item);

    if (selectedDate) {
        reports = reports.filter((report) => report.date === selectedDate);
    }

    if (!reports.length) {
        container.innerHTML = "<p>Aucun rapport trouvé.</p>";
        return;
    }

    reports.forEach((report) => {
        const motive = report.motive || report.motif || "-";
        const balanceSheet =
            report["balance sheet"] ||
            report.balanceSheet ||
            report.bilan ||
            "-";

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <p><strong>ID :</strong> ${report.id || "-"}</p>
            <p><strong>Date :</strong> ${report.date || "-"}</p>
            <p><strong>Motif :</strong> ${motive}</p>
            <p><strong>Bilan :</strong> ${balanceSheet}</p>
            <p style="margin-top:12px;">
                <a href="rapport-form.html?reportId=${report.id}" style="color:#111;">Modifier</a>
            </p>
        `;

        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const errorEl = document.getElementById("error");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            errorEl.textContent = "";

            const login = document.getElementById("login").value;
            const password = document.getElementById("password").value;

            try {
                const token = await loginRequest(login, password);
                localStorage.setItem(tokenKey, token);
                window.location.href = "medecins.html";
            } catch (error) {
                errorEl.textContent = error.message;
            }
        });
    }

    const medecinsList = document.getElementById("medecinsList");
    if (medecinsList) {
        const token = localStorage.getItem(tokenKey);

        if (!token) {
            window.location.href = "index.html";
            return;
        }

        loadMedecins(1, "");

        document.getElementById("searchBtn").addEventListener("click", () => {
            const search = document.getElementById("searchInput").value;
            loadMedecins(1, search);
        });

        document.getElementById("reloadBtn").addEventListener("click", () => {
            document.getElementById("searchInput").value = "";
            loadMedecins(1, "");
        });

        document.getElementById("prevBtn").addEventListener("click", () => {
            if (currentPage > 1) {
                loadMedecins(currentPage - 1, currentSearch);
            }
        });

        document.getElementById("nextBtn").addEventListener("click", () => {
            if (currentPage < totalPages) {
                loadMedecins(currentPage + 1, currentSearch);
            }
        });

        document.getElementById("logoutBtn").addEventListener("click", () => {
            logoutFrontendOnly();
        });
    }

    const doctorCard = document.getElementById("doctorCard");
    if (doctorCard) {
        const token = localStorage.getItem(tokenKey);

        if (!token) {
            window.location.href = "index.html";
            return;
        }

        const doctorId = getQueryParam("id");

        if (!doctorId) {
            document.getElementById("error").textContent = "ID médecin manquant";
            return;
        }

        const newReportLink = document.getElementById("newReportLink");
        if (newReportLink) {
            newReportLink.href = `rapport-form.html?doctorId=${doctorId}`;
        }

        const loadDoctorPage = async () => {
            const errorEl = document.getElementById("error");
            errorEl.textContent = "";

            try {
                const doctorData = await fetchDoctorById(doctorId);
                renderDoctor(doctorData);
                renderDoctorReports(doctorData);
            } catch (error) {
                errorEl.textContent = error.message;
            }
        };

        loadDoctorPage();

        document.getElementById("logoutBtn").addEventListener("click", () => {
            logoutFrontendOnly();
        });
    }

    const reportForm = document.getElementById("reportForm");
    if (reportForm) {
        const token = localStorage.getItem(tokenKey);

        if (!token) {
            window.location.href = "index.html";
            return;
        }

        const doctorId = getQueryParam("doctorId");
        const reportId = getQueryParam("reportId");

        const backLink = document.getElementById("backToDoctorLink");
        const formTitle = document.getElementById("formTitle");
        const formHeading = document.getElementById("formHeading");
        const submitBtn = document.getElementById("submitBtn");

        if (doctorId && backLink) {
            backLink.href = `medecin.html?id=${doctorId}`;
        } else if (reportId && backLink) {
            backLink.href = `rapports.html`;
        }

        if (reportId) {
            formTitle.textContent = "GSB — Modifier rapport";
            formHeading.textContent = "Modifier un rapport";
            submitBtn.textContent = "Mettre à jour";

            fetchReportById(reportId).then((report) => {
                document.getElementById("date").value = report.date || "";
                document.getElementById("motive").value = report.motive || "";
                document.getElementById("balanceSheet").value =
                    report["balance sheet"] || "";
                document.getElementById("medicineId").value = report.medicineId || "";
                document.getElementById("quantity").value = report.quantity || 1;
            }).catch((error) => {
                document.getElementById("error").textContent = error.message;
            });
        }

        reportForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const errorEl = document.getElementById("error");
            const successEl = document.getElementById("success");

            errorEl.textContent = "";
            successEl.textContent = "";

            const payload = {
                balanceSheet: document.getElementById("balanceSheet").value,
                motive: document.getElementById("motive").value,
                doctorId: doctorId ? Number(doctorId) : undefined,
                date: document.getElementById("date").value,
                medicineId: document.getElementById("medicineId").value,
                quantity: Number(document.getElementById("quantity").value)
            };

            try {
                if (reportId) {
                    await updateReport(reportId, payload);
                    successEl.textContent = "Rapport modifié avec succès.";

                    setTimeout(() => {
                        window.location.href = "rapports.html";
                    }, 1000);
                } else {
                    await createReport(payload);
                    successEl.textContent = "Rapport créé avec succès.";

                    setTimeout(() => {
                        window.location.href = `medecin.html?id=${doctorId}`;
                    }, 1000);
                }
            } catch (error) {
                errorEl.textContent = error.message;
            }
        });

        document.getElementById("logoutBtn").addEventListener("click", () => {
            logoutFrontendOnly();
        });
    }

    const reportsPageList = document.getElementById("reportsPageList");
    if (reportsPageList) {
        const token = localStorage.getItem(tokenKey);

        if (!token) {
            window.location.href = "index.html";
            return;
        }

        const loadReportsPage = async () => {
            const errorEl = document.getElementById("error");
            errorEl.textContent = "";

            const selectedDate = document.getElementById("dateFilter").value;

            try {
                const data = await fetchReports(1);
                renderReportsPage(data, selectedDate);
            } catch (error) {
                errorEl.textContent = error.message;
            }
        };

        loadReportsPage();

        document.getElementById("filterReportsBtn").addEventListener("click", () => {
            loadReportsPage();
        });

        document.getElementById("resetReportsBtn").addEventListener("click", () => {
            document.getElementById("dateFilter").value = "";
            loadReportsPage();
        });

        document.getElementById("logoutBtn").addEventListener("click", () => {
            logoutFrontendOnly();
        });
    }
});