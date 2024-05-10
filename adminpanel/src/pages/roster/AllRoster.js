import React, { useEffect, useState } from "react";
import Header from "../../component/header";
import Sidebar from "../../component/sidebar";
import Footer from "../../component/footer";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
// Mendefinisikan komponen AllRoster
function AllRoster() {
  // State untuk menyimpan data pengajar yang telah difilter
  const [filteredPengajar, setFilteredPengajar] = useState([]);

  // State untuk menyimpan data mata pelajaran
  const [mataPelajaran, setMataPelajaran] = useState([]);

  // State untuk menyimpan data roster
  const [rosters, setRosters] = useState([]);

  // State untuk menyimpan data kelas
  const [kelas, setKelas] = useState([]);

  // State untuk menyimpan hari yang dipilih
  const [selectedDay, setSelectedDay] = useState("");

  // State untuk menyimpan kata kunci pencarian
  const [searchTerm, setSearchTerm] = useState("");

  // State untuk menyimpan kelas yang dipilih
  const [selectedKelas, setSelectedKelas] = useState(null);

  // Mendapatkan URL dasar dari file konfigurasi
  const { BASE_URL } = require("../../configapi");

  // State untuk menyimpan halaman saat ini
  const [currentPage, setCurrentPage] = useState(0);

  // Konstanta untuk jumlah item per halaman
  const PER_PAGE = 8;

  // Fetch data kelas dari API ketika komponen dimuat
  useEffect(() => {
    fetch(`${BASE_URL}api/kelas`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setKelas(data);
          handleAllClassesClick();
        }
      });
  }, []);

  // Fungsi untuk mengubah halaman saat ini
  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  // Fungsi untuk mengubah pengajar yang difilter berdasarkan mata pelajaran yang dipilih
  const handleMataPelajaranChange = (event) => {
    const selectedMataPelajaran = event.target.value;
    const filtered = pengajar.filter(
      (pengajarItem) => pengajarItem.Bidang === selectedMataPelajaran
    );
    setFilteredPengajar(filtered);
  };

  // Menghitung offset berdasarkan halaman saat ini
  const offset = currentPage * PER_PAGE;

  // Mendapatkan data roster untuk halaman saat ini
  const currentPageData = rosters.filter(
    (roster) =>
      (!selectedDay || roster.hari === selectedDay) &&
      (roster.mata_pelajaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roster.pengajar.Nama_Depan.toLowerCase().includes(
          searchTerm.toLowerCase()
        ) ||
        roster.pengajar.Nama_Belakang.toLowerCase().includes(
          searchTerm.toLowerCase()
        ))
  );

  // Menghitung jumlah halaman
  const pageCount = Math.ceil(rosters.length / PER_PAGE);

  // Fungsi untuk mengubah kata kunci pencarian
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Fetch semua data roster dari API ketika komponen dimuat
  useEffect(() => {
    handleAllClassesClick();
  }, []);

  // Fungsi untuk fetch semua data roster dari API
  const handleAllClassesClick = () => {
    fetch(`${BASE_URL}api/roster`)
      .then((response) => response.json())
      .then((data) => {
        const rostersWithPengajarAndKelas = data.map((roster) => {
          return Promise.all([
            fetch(`${BASE_URL}api/pengajar/${roster.pengajar_id}`),
            fetch(`${BASE_URL}api/kelas/${roster.kelas_id}`),
          ])
            .then(([pengajarResponse, kelasResponse]) =>
              Promise.all([pengajarResponse.json(), kelasResponse.json()])
            )
            .then(([pengajar, kelas]) => {
              return { ...roster, pengajar, kelas };
            })
            .catch((error) => console.error(error));
        });
        return Promise.all(rostersWithPengajarAndKelas);
      })
      .then((rosters) => setRosters(rosters))
      .catch((error) => console.error(error));
  };

  // State untuk menyimpan data pengajar
  const [pengajar, setPengajar] = useState([]);

  // Fetch data pengajar dari API ketika komponen dimuat
  useEffect(() => {
    fetch(`${BASE_URL}api/pengajar`)
      .then((response) => response.json())
      .then((data) => {
        setPengajar(data);
        const bidang = data.map((pengajar) => pengajar.Bidang);
        setMataPelajaran(bidang);
      })
      .catch((error) => console.error(error));
  }, []);

  // Fungsi untuk mengubah hari yang dipilih
  const handleDayChange = (event) => {
    setSelectedDay(event.target.value);
  };

  // Fungsi untuk menangani submit form
  const handleFormSubmit = (event) => {
    // ... (kode di sini telah dipotong untuk menjaga panjang komentar)
  };

  // Mendapatkan array mata pelajaran unik
  const uniqueMataPelajaran = mataPelajaran.reduce((unique, item) => {
    return unique.includes(item) ? unique : [...unique, item];
  }, []);

  // Fungsi untuk menangani klik tombol

  const handleButtonClick = (id) => {
    fetch(`${BASE_URL}api/kelas/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedKelas(data);
        const rostersWithPengajarAndKelas = data.rosters.map((roster) => {
          return Promise.all([
            fetch(`${BASE_URL}api/pengajar/${roster.pengajar_id}`),
            fetch(`${BASE_URL}api/kelas/${roster.kelas_id}`),
          ])
            .then(([pengajarResponse, kelasResponse]) =>
              Promise.all([pengajarResponse.json(), kelasResponse.json()])
            )
            .then(([pengajar, kelas]) => {
              return { ...roster, pengajar, kelas };
            })
            .catch((error) => console.error(error));
        });
        return Promise.all(rostersWithPengajarAndKelas);
      })
      .then((rosters) => setRosters(rosters))
      .catch((error) => console.error(error));
  };
  // Array warna untuk styling

  const colors = ["bg-success", "bg-warning", "bg-primary"];
  return (
    <div id="layout-wrapper">
      <div
        className="modal fade"
        id="event-modal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        style={{ display: "none" }}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header py-3 px-4">
              <h5 className="modal-title" id="modal-title">
                Tambahkan Roster
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-4">
              <form
                className="needs-validation"
                name="event-form"
                id="form-event"
                noValidate=""
                onSubmit={handleFormSubmit}
              >
                <div className="row">
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">Mata Pelajaran</label>
                      <select
                        className="form-control"
                        name="mata_pelajaran"
                        id="mata_pelajaran"
                        required=""
                        onChange={handleMataPelajaranChange}
                      >
                        <option value="">Pilih Mata Pelajaran</option>
                        {uniqueMataPelajaran.map((mataPelajaranItem, index) => (
                          <option key={index} value={mataPelajaranItem}>
                            {mataPelajaranItem}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Kelas</label>
                      <select
                        className="form-control"
                        name="kelas"
                        id="kelas"
                        required=""
                      >
                        <option value="">Pilih Kelas</option>
                        {kelas.map((kelasItem, index) => (
                          <option key={index} value={kelasItem.id}>
                            {kelasItem.nama_kelas}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Guru Pengajar</label>
                      <select
                        className="form-control"
                        name="guru_pengajar"
                        id="guru_pengajar"
                        required=""
                      >
                        <option value="">Pilih Guru Pengajar</option>
                        {filteredPengajar.map((pengajarItem, index) => (
                          <option key={index} value={pengajarItem.ID}>
                            {pengajarItem.Nama_Depan}{" "}
                            {pengajarItem.Nama_Belakang}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Hari</label>
                      <select
                        className="form-control"
                        name="hari"
                        id="hari"
                        required=""
                      >
                        <option value="Senin">Senin</option>
                        <option value="Selasa">Selasa</option>
                        <option value="Rabu">Rabu</option>
                        <option value="Kamis">Kamis</option>
                        <option value="Jumat">Jumat</option>
                        <option value="Sabtu">Sabtu</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Waktu Mulai</label>
                      <input
                        className="form-control"
                        placeholder="Masukkan Waktu Mulai"
                        type="time"
                        name="waktu_mulai"
                        id="waktu_mulai"
                        required=""
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Waktu Selesai</label>
                      <input
                        className="form-control"
                        placeholder="Masukkan Waktu Selesai"
                        type="time"
                        name="waktu_selesai"
                        id="waktu_selesai"
                        required=""
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-12 text-end">
                    <button
                      type="button"
                      className="btn btn-light me-1"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success"
                      id="btn-save-event"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Header />
      <Sidebar />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-sm-flex a  lign-items-center justify-content-between">
                  <h4 className="mb-sm-0">Daftar Kelas</h4>

                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <a href="javascript: void(0);">Upcube</a>
                      </li>
                      <li className="breadcrumb-item active">Calendar</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mb-5">
              <div className="col-xl-3">
                <div className="card h-100">
                  <div className="card-body">
                    <button
                      type="button"
                      class="btn font-16 btn-info waves-effect waves-light w-100"
                      id="btn-new-event"
                      data-bs-toggle="modal"
                      data-bs-target="#event-modal"
                    >
                      Tambahkan Roster
                    </button>
                    <div id="external-events">
                      <br />
                      <p className="text-muted">Daftar Kelas </p>
                      <button
                        className="btn btn-secondary w-100"
                        onClick={handleAllClassesClick}
                        style={{ marginBottom: "1em" }}
                      >
                        <i className="mdi font-size-15 me-10"></i>Semua Kelas
                      </button>

                      {Array.isArray(kelas) &&
                        kelas.map((kelasItem, index) => (
                          <div
                            key={index}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <button
                              className={`external-event fc-event w-100 ${
                                colors[index % colors.length]
                              }`}
                              data-className={colors[index % colors.length]}
                              onClick={() => handleButtonClick(kelasItem.id)}
                              style={{ flex: 1 }} // This will make the button take up the remaining space
                            >
                              <i className="mdi font-size-11 me-2"></i>
                              {kelasItem.nama_kelas}
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-9">
                <div className="card mb-0">
                  <div class="card-body">
                    {selectedKelas && (
                      <>
                        <h4 class="card-title"> {selectedKelas.nama_kelas}</h4>
                      </>
                    )}
                    <div class="row">
                      <div class="col-sm-12 col-md-9">
                        <div
                          class="dataTables_length"
                          id="complex-header-datatable_length"
                          style={{ marginLeft: "2em" }} // Add this line
                        >
                          <label>
                            Filter by Day:
                            <select
                              name="complex-header-datatable_length"
                              aria-controls="complex-header-datatable"
                              className="custom-select custom-select-sm form-control form-control-sm form-select form-select-sm"
                              style={{ width: "11em", marginTop: "0.5em" }}
                              onChange={handleDayChange} // Tambahkan ini
                            >
                              <option value="">Semua Hari </option>
                              <option value="Senin">Senin</option>
                              <option value="Selasa">Selasa</option>
                              <option value="Rabu">Rabu</option>
                              <option value="Kamis">Kamis</option>
                              <option value="Jumat">Jumat</option>
                              <option value="Sabtu">Sabtu</option>
                            </select>
                          </label>
                        </div>
                      </div>
                      <div class="col-sm-12 col-md-2">
                        <div
                          id="complex-header-datatable_filter"
                          class="dataTables_filter"
                        >
                          <label>
                            Search:
                            <input
                              type="search"
                              style={{ width: "140" }}
                              class="form-control form-control-sm"
                              placeholder="Cari disini "
                              aria-controls="complex-header-datatable"
                              onChange={handleSearchChange}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div class="table-responsive">
                      <table className="table table-striped mb-0">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Mata Pelajaran</th>
                            <th>Kelas</th>
                            <th>Guru Pengajar</th>
                            <th>Hari</th>
                            <th>Waktu Mulai</th>
                            <th>Waktu Selesai</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rosters
                            .filter(
                              (roster) =>
                                (!selectedDay || roster.hari === selectedDay) &&
                                (roster.mata_pelajaran
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase()) ||
                                  roster.pengajar.Nama_Depan.toLowerCase().includes(
                                    searchTerm.toLowerCase()
                                  ) ||
                                  roster.pengajar.Nama_Belakang.toLowerCase().includes(
                                    searchTerm.toLowerCase()
                                  ))
                            )
                            .slice(offset, offset + PER_PAGE)
                            .map((roster, index) => {
                              return (
                                <tr key={index}>
                                  <td>{offset + index + 1}</td>{" "}
                                  {/* Updated this line */}
                                  <td>{roster.mata_pelajaran}</td>
                                  <td>{roster.kelas.nama_kelas}</td>
                                  <td>
                                    {roster.pengajar.Nama_Depan}{" "}
                                    {roster.pengajar.Nama_Belakang}
                                  </td>
                                  <td>{roster.hari}</td>
                                  <td>{roster.waktu_mulai}</td>
                                  <td>{roster.waktu_selesai}</td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                    <div className="row">
                      <div className="col-sm-12 col-md-5 mt-4">
                        <div
                          className="dataTables_info"
                          id="datatable-buttons_info"
                          role="status"
                          aria-live="polite"
                        >
                          Showing {currentPage * PER_PAGE + 1} to{" "}
                          {Math.min(
                            (currentPage + 1) * PER_PAGE,
                            rosters.length
                          )}{" "}
                          of {rosters.length} entries
                        </div>
                      </div>
                      <div className="col-sm-12 col-md-7">
                        <div
                          className="dataTables_paginate paging_simple_numbers"
                          id="datatable-buttons_paginate"
                        >
                          <ReactPaginate
                            previousLabel={"previous"}
                            nextLabel={"next"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={8}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ clear: "both" }}></div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
export default AllRoster;
