import { StorageUtil } from './utils.js';

export class CustomerFormHandler {
  constructor(form) {
    this.form = form;
    this.messageBox = document.getElementById('messageBox');
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.form.addEventListener('input', this.realTimeValidation.bind(this));
  }

  validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (data.fullName.length < 3) return "Name must be at least 3 characters";
    if (!/^\d{10}$/.test(data.phone)) return "Phone must be exactly 10 digits";
    if (!emailRegex.test(data.email)) return "Invalid email format";
    if (!data.vehicle) return "Vehicle is required";
    if (data.complaint.length < 10) return "Complaint must be at least 10 characters";

    return null;
  }

  saveToLocalStorage(data) {
    const records = StorageUtil.getItem('submissions');
    records.push(data);
    StorageUtil.setItem('submissions', records);
  }

  clearForm() {
    this.form.reset();
  }

  showMessage(msg, type) {
    this.messageBox.textContent = msg;
    this.messageBox.className = type;
  }

  realTimeValidation(e) {
    if (e.target.name) {
      const data = Object.fromEntries(new FormData(this.form));
      const error = this.validateForm(data);
      if (error) this.showMessage(error, "error");
      else this.showMessage("", "");
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this.form));
    const error = this.validateForm(data);

    if (error) {
      this.showMessage(error, "error");
      return;
    }

    this.saveToLocalStorage(data);
    this.showMessage("Form submitted successfully!", "success");
    this.clearForm();
  }
}
