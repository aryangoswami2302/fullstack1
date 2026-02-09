import { StorageUtil } from './utils.js';

class SubmissionViewer {
  constructor() {
    this.data = StorageUtil.getItem('submissions');
    this.tableBody = document.getElementById('tableBody');
    this.noData = document.getElementById('noData');
    document.getElementById('search').addEventListener('input', this.filter.bind(this));
    this.render(this.data);
  }

  render(data) {
    this.tableBody.innerHTML = "";

    if (!data.length) {
      this.noData.textContent = "No data found";
      return;
    }

    this.noData.textContent = "";

    data.forEach((item, index) => {
      const row = `
        <tr>
          <td>${item.fullName}</td>
          <td>${item.phone}</td>
          <td>${item.email}</td>
          <td>${item.vehicle}</td>
          <td>${item.complaint}</td>
          <td><button data-index="${index}">Delete</button></td>
        </tr>`;
      this.tableBody.innerHTML += row;
    });

    this.tableBody.addEventListener('click', e => {
      if (e.target.tagName === "BUTTON") {
        this.deleteRecord(e.target.dataset.index);
      }
    });
  }

  filter(e) {
    const value = e.target.value.toLowerCase();
    const filtered = this.data.filter(d =>
      d.fullName.toLowerCase().includes(value) ||
      d.vehicle.toLowerCase().includes(value)
    );
    this.render(filtered);
  }

  deleteRecord(index) {
    this.data.splice(index, 1);
    StorageUtil.setItem('submissions', this.data);
    this.render(this.data);
  }
}

new SubmissionViewer();
