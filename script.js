class MiniCRM {
    constructor() {
        this.leads = JSON.parse(localStorage.getItem('crm-leads')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSampleData();
        this.renderLeads();
        this.updateStats();
    }

    bindEvents() {
        document.getElementById('add-lead-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addLead();
        });

        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filterLeads();
        });

        document.getElementById('status-filter').addEventListener('change', (e) => {
            this.filterLeads();
        });

        document.getElementById('refresh-btn').addEventListener('click', () => {
            this.refreshLeads();
        });
    }

    loadSampleData() {
        if (this.leads.length === 0) {
            this.leads = [
                {
                    id: 1,
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    phone: '9876543210',
                    company: 'Tech Solutions Inc.',
                    status: 'new',
                    dateAdded: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Jane Smith',
                    email: 'jane.smith@example.com',
                    phone: '9876543211',
                    company: 'Digital Marketing Co.',
                    status: 'contacted',
                    dateAdded: new Date().toISOString()
                },
                {
                    id: 3,
                    name: 'Mike Johnson',
                    email: 'mike.johnson@example.com',
                    phone: '9876543212',
                    company: 'Web Development LLC',
                    status: 'sold',
                    dateAdded: new Date().toISOString()
                },
                {
                    id: 4,
                    name: 'Sarah Wilson',
                    email: 'sarah.wilson@example.com',
                    phone: '9876543213',
                    company: 'Creative Agency',
                    status: 'new',
                    dateAdded: new Date().toISOString()
                }
            ];
            this.saveLeads();
        }
    }

    addLead() {
        const name = document.getElementById('lead-name').value;
        const email = document.getElementById('lead-email').value;
        const phone = document.getElementById('lead-phone').value;
        const company = document.getElementById('lead-company').value;

        const newLead = {
            id: Date.now(),
            name,
            email,
            phone,
            company,
            status: 'new',
            dateAdded: new Date().toISOString()
        };

        this.leads.unshift(newLead);
        this.saveLeads();
        this.renderLeads();
        this.updateStats();

        // Reset form
        document.getElementById('add-lead-form').reset();

        // Show success message
        this.showNotification('Lead added successfully!', 'success');
    }

    updateLeadStatus(id, status) {
        const lead = this.leads.find(l => l.id === id);
        if (lead) {
            lead.status = status;
            this.saveLeads();
            this.renderLeads();
            this.updateStats();
            this.showNotification(`Lead marked as ${status}!`, 'success');
        }
    }

    deleteLead(id) {
        if (confirm('Are you sure you want to delete this lead?')) {
            this.leads = this.leads.filter(l => l.id !== id);
            this.saveLeads();
            this.renderLeads();
            this.updateStats();
            this.showNotification('Lead deleted successfully!', 'success');
        }
    }

    filterLeads() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const statusFilter = document.getElementById('status-filter').value;

        let filteredLeads = this.leads;

        if (searchTerm) {
            filteredLeads = filteredLeads.filter(lead =>
                lead.name.toLowerCase().includes(searchTerm) ||
                lead.email.toLowerCase().includes(searchTerm) ||
                lead.company.toLowerCase().includes(searchTerm)
            );
        }

        if (statusFilter) {
            filteredLeads = filteredLeads.filter(lead => lead.status === statusFilter);
        }

        this.renderLeads(filteredLeads);
    }

    renderLeads(leadsToRender = this.leads) {
        const container = document.getElementById('leads-container');
        
        if (leadsToRender.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-users fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No leads found</h5>
                    <p class="text-muted">Add your first lead to get started!</p>
                </div>
            `;
            return;
        }

        const leadsHTML = leadsToRender.map(lead => `
            <div class="lead-card fade-in">
                <div class="row align-items-center">
                    <div class="col-lg-4 col-md-6 mb-3 mb-lg-0">
                        <div class="d-flex align-items-center">
                            <div class="me-3">
                                <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                                    <i class="fas fa-user"></i>
                                </div>
                            </div>
                            <div>
                                <h6 class="mb-1">${lead.name}</h6>
                                <small class="text-muted">${lead.company || 'No company'}</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-3 mb-lg-0">
                        <div>
                            <small class="text-muted d-block">Email</small>
                            <span>${lead.email}</span>
                        </div>
                        <div class="mt-1">
                            <small class="text-muted d-block">Phone</small>
                            <span>${lead.phone}</span>
                        </div>
                    </div>
                    <div class="col-lg-2 col-md-6 mb-3 mb-lg-0">
                        <span class="lead-status status-${lead.status}">${lead.status.replace('-', ' ')}</span>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <div class="d-flex flex-wrap gap-2">
                            <a href="tel:${lead.phone}" class="btn-action btn-call">
                                <i class="fas fa-phone"></i>
                                Call
                            </a>
                            <a href="mailto:${lead.email}" class="btn-action btn-email">
                                <i class="fas fa-envelope"></i>
                                Email
                            </a>
                            ${lead.status !== 'sold' ? `
                                <button class="btn-action btn-sold" onclick="crm.updateLeadStatus(${lead.id}, 'sold')">
                                    <i class="fas fa-check"></i>
                                    Sold
                                </button>
                            ` : ''}
                            ${lead.status !== 'not-sold' ? `
                                <button class="btn-action btn-not-sold" onclick="crm.updateLeadStatus(${lead.id}, 'not-sold')">
                                    <i class="fas fa-times"></i>
                                    Not Sold
                                </button>
                            ` : ''}
                            <button class="btn-action" style="background: #6b7280; color: white;" onclick="crm.deleteLead(${lead.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = leadsHTML;
    }

    updateStats() {
        const total = this.leads.length;
        const sold = this.leads.filter(l => l.status === 'sold').length;
        const pending = this.leads.filter(l => l.status === 'new' || l.status === 'contacted').length;
        const conversionRate = total > 0 ? Math.round((sold / total) * 100) : 0;

        document.getElementById('total-leads').textContent = total;
        document.getElementById('sold-leads').textContent = sold;
        document.getElementById('pending-leads').textContent = pending;
        document.getElementById('conversion-rate').textContent = `${conversionRate}%`;
    }

    refreshLeads() {
        const refreshBtn = document.getElementById('refresh-btn');
        const originalHTML = refreshBtn.innerHTML;
        
        refreshBtn.innerHTML = '<div class="loading-spinner"></div> Refreshing...';
        refreshBtn.disabled = true;

        setTimeout(() => {
            this.renderLeads();
            this.updateStats();
            refreshBtn.innerHTML = originalHTML;
            refreshBtn.disabled = false;
            this.showNotification('Leads refreshed!', 'info');
        }, 1000);
    }

    saveLeads() {
        localStorage.setItem('crm-leads', JSON.stringify(this.leads));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} position-fixed`;
        notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize CRM
const crm = new MiniCRM();

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});