
## Modul yang Tersedia
- `customers` — CRUD untuk nasabah (schema, DTO, service, controller)  
- `transactions` — membuat transaksi dengan dukungan MongoDB transactions/session dan idempotency  
- `payments` — service internal untuk memanggil payment gateway eksternal (mock via JSONPlaceholder)  
- `notifications` — service internal untuk mengirim notifikasi (mock via https://webhook.site/)  

---

## Cara Cepat Menjalankan
1. Salin `.env.example` menjadi `.env` lalu ubah sesuai kebutuhan:
   ```bash
   cp .env.example .env
   ```
2. Pastikan sudah menginstal **Docker Desktop**.
3. Jalankan perintah:
   ```bash
   docker-compose up -d
4. API tersedia di: http://localhost:3000
5. API yang tersedia:
   - `POST /customers` — membuat nasabah baru
   - `GET /customers/:id` — mendapatkan data nasabah by id
   - `POST /transactions` — membuat transaksi (otomatis memanggil mock payment gateway)
   - `GET /transactions` — menampilkan semua transaksi
   - `GET /transactions/:id` — mendapatkan transaksi berdasarkan id

---

## 1) Arsitektur / Pola Coding
- **Pola:** Modular monolith dengan prinsip siap dipecah menjadi microservices.  
  Setiap domain dipisah ke dalam modul sendiri (Customers, Transactions, Payments, Notifications) dengan controller, service, dan repository masing-masing.

- **Alasan Pemilihan Pola**
  1. **Skalabilitas:** mudah dipisah jadi microservice ketika beban meningkat (misalnya Transactions berdiri sendiri).  
  2. **Maintainability:** dependency injection NestJS membuat code lebih rapi, testable, dan mudah di-maintain tim besar.  
  3. **High concurrency:** NestJS berbasis Node.js non-blocking I/O, sehingga bisa handle ribuan request paralel.  
  4. **Isolasi service:** setiap service punya boundary jelas. Jika nanti di-split ke microservices, minim perubahan.  

---

## 2) Tech Stack
- **Backend Framework: NestJS (TypeScript)**  
  - Mendukung dependency injection, modular architecture, dan middleware yang jelas.  
  - TypeScript memberi type safety, sangat penting untuk sistem finansial.  

- **Library Tambahan:**
  1. `@nestjs/mongoose` → integrasi dengan MongoDB + transaksi multi-document.  
  2. `class-validator` + `class-transformer` → validasi input (misalnya nominal tidak boleh negatif).  
  3. `@nestjs/axios` → komunikasi dengan API eksternal (mock payment gateway & notifikasi).  
  4. `dotenv` → manajemen konfigurasi sensitif (API key, DB password, dsb).  

- **Kenapa Stack Ini Cocok untuk Fintech**
  1. Reliabel & aman (validasi input + transaksi database).  
  2. Mudah integrasi dengan layanan eksternal (bank, e-wallet, provider notifikasi).  
  3. Modular, jadi tim engineering bisa scaling cepat.  

---

## 3) Database & Integrasi Eksternal
- **Database: MongoDB**  
  - Mendukung transaksi multi-document.  
  - Fleksibilitas schema (data nasabah/transaksi bisa berubah tanpa migrasi kompleks).  
  - Skalabilitas horizontal dengan sharding.  

- **Kenapa Bukan SQL?**  
  SQL seperti PostgreSQL juga cocok untuk finansial, tapi MongoDB dipilih karena fleksibel untuk pengembangan cepat dan perubahan schema yang sering.  

- **Integrasi dengan 2 Layanan Eksternal**
  1. **Payment Gateway Mock (JSONPlaceholder)**  
     - Digunakan untuk simulasi pemotongan saldo / pembayaran.
     - Endpoint: `https://jsonplaceholder.typicode.com/posts`
     - Dipanggil saat membuat transaksi dengan tipe **debit**. 

  2. **Notification Service (Webhook.site)** 
     - Digunakan untuk simulasi pengiriman notifikasi setelah transaksi berhasil.
     - Endpoint contoh (ganti sesuai kebutuhan, masuk ke website Webhook.site untuk melihat uniq id anda):  
     `https://webhook.site/your-uniq-id`
     - Payload notifikasi akan dikirim ke URL ini, sehingga bisa melihat log notifikasi real-time di halaman Webhook.site.  

- **Keamanan Integrasi**  
  - Semua konfigurasi eksternal disimpan di `.env`.  
  - Komunikasi eksternal dilakukan via service di NestJS.  
  - Response dari layanan eksternal bisa disimpan di database sebagai audit trail.  

## 4) Testing & Dokumentasi
- **Unit Test**  
Project ini menggunakan Jest (default dari NestJS) untuk unit testing.
Sudah tersedia contoh unit test untuk minimal 2 endpoint:

1 CustomersController
 - Test POST /customers untuk membuat nasabah baru.
 - Test GET /customers/:id untuk mendapatkan nasabah berdasarkan id.

2. TransactionsController
 - Test POST /transactions untuk membuat transaksi (mock payment gateway).
 - Test GET /transactions/:id untuk validasi pengambilan transaksi.

 Cara menjalankan test:
  ```bash
  npm run test
  ```

- **API Documentation** 
Untuk dokumentasi API, project ini sudah terintegrasi dengan Swagger (OpenAPI) menggunakan @nestjs/swagger.
1. Dokumentasi otomatis tersedia di endpoint:
http://localhost:3000/api-docs

2. Swagger akan memuat seluruh endpoint (/customers, /transactions, dll) lengkap dengan:
- Parameter input (DTO dengan validasi).
- Contoh payload.

Cara akses:
1. Jalankan server (docker-compose up -d).
2. Buka browser: http://localhost:3000/api-docs


---

## Step-by-step Install MongoDB (Local Development)

### Dengan Docker
1. Install Docker Desktop (Windows/macOS) atau Docker Engine (Linux).  
2. Jalankan container MongoDB sebagai single-node replica set:  
   ```bash
   docker network create mongo-net || true
   docker run -d --name mongo1 --net mongo-net -p 27017:27017      -e MONGO_INITDB_ROOT_USERNAME=admin      -e MONGO_INITDB_ROOT_PASSWORD=secret      mongo:6 --replSet rs0 --bind_ip_all
   # inisialisasi replica set
   docker exec -it mongo1 mongosh -u admin -p secret --eval "rs.initiate()"
   ```
3. Contoh connection string (sesuai `.env.example`):  
   ```
   mongodb://admin:secret@localhost:27017/fintech?authSource=admin
   ```

---

