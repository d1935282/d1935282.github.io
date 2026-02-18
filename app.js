const storageKey = "garageManagerData";

const seedData = () => ({
  customers: [
    {
      id: "cust-1001",
      name: "Lena Morales",
      email: "lena.morales@email.com",
      phone: "(415) 555-3812",
      address: "1429 Cedar Ridge, San Francisco, CA",
    },
    {
      id: "cust-1002",
      name: "Darren Hughes",
      email: "darren.hughes@email.com",
      phone: "(312) 555-9021",
      address: "88 West Loop Ave, Chicago, IL",
    },
    {
      id: "cust-1003",
      name: "Priya Patel",
      email: "priya.patel@email.com",
      phone: "(646) 555-7784",
      address: "401 Madison Street, New York, NY",
    },
  ],
  vehicles: [
    {
      id: "veh-2001",
      customerId: "cust-1001",
      make: "Toyota",
      model: "RAV4",
      year: 2021,
      vin: "JTMBFREV5MD010201",
      plate: "8ZKX921",
    },
    {
      id: "veh-2002",
      customerId: "cust-1002",
      make: "Ford",
      model: "F-150",
      year: 2019,
      vin: "1FTEW1E50KFB23411",
      plate: "IL 5H3499",
    },
    {
      id: "veh-2003",
      customerId: "cust-1003",
      make: "Tesla",
      model: "Model 3",
      year: 2022,
      vin: "5YJ3E1EA0NF123455",
      plate: "NYC EV-84",
    },
  ],
  jobs: [
    {
      id: "job-3001",
      customerId: "cust-1001",
      vehicleId: "veh-2001",
      description: "30K mile service, brake inspection",
      assignedTech: "Marcus Hill",
      startDate: "2024-02-01",
      dueDate: "2024-02-05",
      laborHours: 3.5,
      partsCost: 180,
      status: "in progress",
    },
    {
      id: "job-3002",
      customerId: "cust-1002",
      vehicleId: "veh-2002",
      description: "Transmission diagnostics",
      assignedTech: "Jules Park",
      startDate: "2024-02-02",
      dueDate: "2024-02-06",
      laborHours: 2.5,
      partsCost: 90,
      status: "open",
    },
    {
      id: "job-3003",
      customerId: "cust-1003",
      vehicleId: "veh-2003",
      description: "ADAS calibration and tire rotation",
      assignedTech: "Amira Khan",
      startDate: "2024-02-03",
      dueDate: "2024-02-07",
      laborHours: 2,
      partsCost: 60,
      status: "completed",
    },
  ],
  invoices: [
    {
      id: "inv-4001",
      jobId: "job-3003",
      customerId: "cust-1003",
      vehicleId: "veh-2003",
      laborRate: 120,
      laborTotal: 240,
      partsCost: 60,
      taxRate: 8.5,
      taxAmount: 25.5,
      total: 325.5,
      issuedDate: "2024-02-04",
      status: "paid",
      notes: "Thank you for trusting AxleWorks.",
    },
  ],
});

const state = loadState();

const elements = {
  customerCount: document.getElementById("customerCount"),
  vehicleCount: document.getElementById("vehicleCount"),
  openJobsCount: document.getElementById("openJobsCount"),
  monthlyRevenue: document.getElementById("monthlyRevenue"),
  todaySummary: document.getElementById("todaySummary"),
  customerTable: document.getElementById("customerTable"),
  vehicleTable: document.getElementById("vehicleTable"),
  jobTable: document.getElementById("jobTable"),
  invoiceTable: document.getElementById("invoiceTable"),
  vehicleCustomerSelect: document.getElementById("vehicleCustomerSelect"),
  jobCustomerSelect: document.getElementById("jobCustomerSelect"),
  jobVehicleSelect: document.getElementById("jobVehicleSelect"),
  invoiceJobSelect: document.getElementById("invoiceJobSelect"),
  invoicePreview: document.getElementById("invoicePreview"),
  seedButton: document.getElementById("seedButton"),
};

const customerForm = document.getElementById("customerForm");
const vehicleForm = document.getElementById("vehicleForm");
const jobForm = document.getElementById("jobForm");
const invoiceForm = document.getElementById("invoiceForm");

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const getCurrentMonth = () => new Date().getMonth();

function loadState() {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    return JSON.parse(saved);
  }
  const seeded = seedData();
  localStorage.setItem(storageKey, JSON.stringify(seeded));
  return seeded;
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
  renderAll();
}

function renderDashboard() {
  elements.customerCount.textContent = state.customers.length;
  elements.vehicleCount.textContent = state.vehicles.length;
  const openJobs = state.jobs.filter((job) => job.status !== "completed");
  elements.openJobsCount.textContent = openJobs.length;

  const revenue = state.invoices
    .filter((invoice) => new Date(invoice.issuedDate).getMonth() === getCurrentMonth())
    .reduce((sum, invoice) => sum + invoice.total, 0);
  elements.monthlyRevenue.textContent = formatCurrency(revenue);

  const today = new Date();
  const dueSoon = state.jobs.filter((job) => {
    const due = new Date(job.dueDate);
    return due >= today && due <= new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
  });

  elements.todaySummary.textContent = `${openJobs.length} active jobs · ${dueSoon.length} due within 3 days`;
}

function renderCustomers() {
  elements.customerTable.innerHTML = state.customers
    .map(
      (customer) => `
      <tr>
        <td>
          <strong>${customer.name}</strong><br />
          <span class="muted">${customer.email}</span>
        </td>
        <td>
          ${customer.phone}
        </td>
        <td>
          ${customer.address}
        </td>
      </tr>
    `
    )
    .join("");
}

function renderCustomerOptions() {
  if (state.customers.length === 0) {
    const placeholder = `<option value="">No customers available</option>`;
    elements.vehicleCustomerSelect.innerHTML = placeholder;
    elements.jobCustomerSelect.innerHTML = placeholder;
    return;
  }

  const options = state.customers
    .map((customer) => `<option value="${customer.id}">${customer.name}</option>`)
    .join("");

  elements.vehicleCustomerSelect.innerHTML = options;
  elements.jobCustomerSelect.innerHTML = options;
}

function renderVehicles() {
  elements.vehicleTable.innerHTML = state.vehicles
    .map((vehicle) => {
      const owner = state.customers.find((customer) => customer.id === vehicle.customerId);
      return `
        <tr>
          <td>${vehicle.year} ${vehicle.make} ${vehicle.model}</td>
          <td>${owner ? owner.name : "Unknown"}</td>
          <td>${vehicle.vin}</td>
          <td>${vehicle.plate}</td>
        </tr>
      `;
    })
    .join("");
}

function renderVehicleOptions(customerId) {
  const filtered = customerId
    ? state.vehicles.filter((vehicle) => vehicle.customerId === customerId)
    : state.vehicles;

  if (filtered.length === 0) {
    elements.jobVehicleSelect.innerHTML = `<option value="">No vehicles available</option>`;
    return;
  }

  elements.jobVehicleSelect.innerHTML = filtered
    .map(
      (vehicle) =>
        `<option value="${vehicle.id}">${vehicle.year} ${vehicle.make} ${vehicle.model}</option>`
    )
    .join("");
}

function renderJobs() {
  elements.jobTable.innerHTML = state.jobs
    .map((job) => {
      const customer = state.customers.find((item) => item.id === job.customerId);
      const vehicle = state.vehicles.find((item) => item.id === job.vehicleId);
      return `
      <tr>
        <td>
          <strong>${job.description}</strong><br />
          <span class="muted">Tech: ${job.assignedTech}</span>
        </td>
        <td>${customer ? customer.name : "Unknown"}</td>
        <td>${vehicle ? `${vehicle.year} ${vehicle.make}` : "Unknown"}</td>
        <td>
          <select class="status-select" data-job-id="${job.id}">
            <option value="open" ${job.status === "open" ? "selected" : ""}>open</option>
            <option value="in progress" ${job.status === "in progress" ? "selected" : ""}>in progress</option>
            <option value="completed" ${job.status === "completed" ? "selected" : ""}>completed</option>
          </select>
        </td>
        <td>${formatDate(job.dueDate)}</td>
      </tr>
      `;
    })
    .join("");

  elements.jobTable.querySelectorAll(".status-select").forEach((select) => {
    select.addEventListener("change", (event) => {
      const job = state.jobs.find((item) => item.id === event.target.dataset.jobId);
      if (job) {
        job.status = event.target.value;
        saveState();
      }
    });
  });
}

function renderInvoiceOptions() {
  if (state.jobs.length === 0) {
    elements.invoiceJobSelect.innerHTML = `<option value="">No jobs available</option>`;
    return;
  }

  elements.invoiceJobSelect.innerHTML = state.jobs
    .map((job) => {
      const vehicle = state.vehicles.find((item) => item.id === job.vehicleId);
      return `<option value="${job.id}">${job.description} · ${vehicle ? `${vehicle.make} ${vehicle.model}` : "Vehicle"}</option>`;
    })
    .join("");
}

function renderInvoices() {
  elements.invoiceTable.innerHTML = state.invoices
    .map((invoice) => {
      const customer = state.customers.find((item) => item.id === invoice.customerId);
      const vehicle = state.vehicles.find((item) => item.id === invoice.vehicleId);
      return `
      <tr>
        <td>
          <strong>${invoice.id}</strong><br />
          <span class="muted">${formatDate(invoice.issuedDate)}</span>
        </td>
        <td>${customer ? customer.name : "Unknown"}</td>
        <td>${vehicle ? `${vehicle.year} ${vehicle.make}` : "Unknown"}</td>
        <td>${formatCurrency(invoice.total)}</td>
        <td>
          <select class="status-select" data-invoice-id="${invoice.id}">
            <option value="pending" ${invoice.status === "pending" ? "selected" : ""}>pending</option>
            <option value="paid" ${invoice.status === "paid" ? "selected" : ""}>paid</option>
          </select>
        </td>
      </tr>
    `;
    })
    .join("");

  elements.invoiceTable.querySelectorAll(".status-select").forEach((select) => {
    select.addEventListener("change", (event) => {
      const invoice = state.invoices.find((item) => item.id === event.target.dataset.invoiceId);
      if (invoice) {
        invoice.status = event.target.value;
        saveState();
      }
    });
  });
}

function updateInvoicePreview(jobId) {
  const job = state.jobs.find((item) => item.id === jobId);
  if (!job) {
    elements.invoicePreview.innerHTML = `<h5>Invoice Preview</h5><p>Select a job to see the calculated totals.</p>`;
    return;
  }
  const vehicle = state.vehicles.find((item) => item.id === job.vehicleId);
  const customer = state.customers.find((item) => item.id === job.customerId);
  const laborRate = Number(invoiceForm.laborRate.value || 0);
  const taxRate = Number(invoiceForm.taxRate.value || 0);
  const laborTotal = job.laborHours * laborRate;
  const taxable = laborTotal + job.partsCost;
  const taxAmount = taxable * (taxRate / 100);
  const total = taxable + taxAmount;

  elements.invoicePreview.innerHTML = `
    <h5>Invoice Preview</h5>
    <p><strong>Customer:</strong> ${customer ? customer.name : "Unknown"}</p>
    <p><strong>Vehicle:</strong> ${vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "Unknown"}</p>
    <p><strong>Labor:</strong> ${job.laborHours} hrs × ${formatCurrency(laborRate)} = ${formatCurrency(
    laborTotal
  )}</p>
    <p><strong>Parts:</strong> ${formatCurrency(job.partsCost)}</p>
    <p><strong>Tax:</strong> ${formatCurrency(taxAmount)} (${taxRate}%)</p>
    <p><strong>Total:</strong> ${formatCurrency(total)}</p>
  `;
}

function renderAll() {
  renderDashboard();
  renderCustomers();
  renderCustomerOptions();
  renderVehicles();
  renderVehicleOptions(elements.jobCustomerSelect.value || state.customers[0]?.id);
  renderJobs();
  renderInvoiceOptions();
  renderInvoices();
  updateInvoicePreview(elements.invoiceJobSelect.value);
}

customerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(customerForm);
  const newCustomer = {
    id: `cust-${Date.now()}`,
    name: formData.get("name").trim(),
    email: formData.get("email").trim(),
    phone: formData.get("phone").trim(),
    address: formData.get("address").trim(),
  };
  state.customers.unshift(newCustomer);
  customerForm.reset();
  saveState();
});

vehicleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(vehicleForm);
  const newVehicle = {
    id: `veh-${Date.now()}`,
    customerId: formData.get("customerId"),
    make: formData.get("make").trim(),
    model: formData.get("model").trim(),
    year: Number(formData.get("year")),
    vin: formData.get("vin").trim(),
    plate: formData.get("plate").trim(),
  };
  state.vehicles.unshift(newVehicle);
  vehicleForm.reset();
  saveState();
});

jobForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(jobForm);
  const newJob = {
    id: `job-${Date.now()}`,
    customerId: formData.get("customerId"),
    vehicleId: formData.get("vehicleId"),
    description: formData.get("description").trim(),
    assignedTech: formData.get("assignedTech").trim(),
    startDate: formData.get("startDate"),
    dueDate: formData.get("dueDate"),
    laborHours: Number(formData.get("laborHours")),
    partsCost: Number(formData.get("partsCost")),
    status: "open",
  };
  state.jobs.unshift(newJob);
  jobForm.reset();
  saveState();
});

invoiceForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(invoiceForm);
  const jobId = formData.get("jobId");
  const job = state.jobs.find((item) => item.id === jobId);
  if (!job) {
    return;
  }
  const laborRate = Number(formData.get("laborRate"));
  const taxRate = Number(formData.get("taxRate"));
  const laborTotal = job.laborHours * laborRate;
  const taxable = laborTotal + job.partsCost;
  const taxAmount = taxable * (taxRate / 100);
  const total = taxable + taxAmount;

  const newInvoice = {
    id: `inv-${Date.now()}`,
    jobId,
    customerId: job.customerId,
    vehicleId: job.vehicleId,
    laborRate,
    laborTotal,
    partsCost: job.partsCost,
    taxRate,
    taxAmount,
    total,
    issuedDate: new Date().toISOString().slice(0, 10),
    status: "pending",
    notes: formData.get("notes").trim(),
  };

  state.invoices.unshift(newInvoice);
  invoiceForm.reset();
  saveState();
});

invoiceForm.addEventListener("input", () => {
  updateInvoicePreview(elements.invoiceJobSelect.value);
});

elements.jobCustomerSelect.addEventListener("change", (event) => {
  renderVehicleOptions(event.target.value);
});

elements.invoiceJobSelect.addEventListener("change", (event) => {
  updateInvoicePreview(event.target.value);
});

elements.seedButton.addEventListener("click", () => {
  const seeded = seedData();
  state.customers = seeded.customers;
  state.vehicles = seeded.vehicles;
  state.jobs = seeded.jobs;
  state.invoices = seeded.invoices;
  saveState();
});

renderAll();
