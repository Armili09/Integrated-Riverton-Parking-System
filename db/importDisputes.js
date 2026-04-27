const { sql, poolPromise } = require('./config');

const data = `2	DSP-0001	Incorrect Vehicle	CIT-00004	MXY4521	2025-03-09 20:20:09	Dismissed	137
3	DSP-0002	Incorrect Vehicle	CIT-00006	YBI9776	2025-02-14 12:54:46	Reduced	173
4	DSP-0003	Meter Malfunction	CIT-00007	UPN3014	2025-09-27 11:01:35	Reduced	81
5	DSP-0004	Meter Malfunction	CIT-00008	ICA3321	2025-05-10 18:06:08	Reduced	70
6	DSP-0005	Incorrect Vehicle	CIT-00009	UJY9466	2025-11-25 15:57:09	Under Review	0
7	DSP-0006	Permit Not Recognized	CIT-00010	BPN8190	2025-08-17 10:24:27	Dismissed	90
8	DSP-0007	Permit Not Recognized	CIT-00012	LPC7867	2025-06-05 18:31:19	Reduced	117
9	DSP-0008	Incorrect Vehicle	CIT-00013	YSC9093	2025-06-29 18:17:40	Reduced	183
10	DSP-0009	Incorrect Vehicle	CIT-00014	WZT6247	2025-10-31 13:01:37	Reduced	239
11	DSP-0010	Fine Reduction	CIT-00015	NVH2594	2025-05-09 19:19:36	Pending	0
12	DSP-0011	Permit Not Recognized	CIT-00016	CVC7880	2025-06-01 21:04:33	Dismissed	187
13	DSP-0012	Citation Dismissal	CIT-00017	IWS3344	2025-05-13 11:55:38	Dismissed	130
14	DSP-0013	Meter Malfunction	CIT-00019	MGO5929	2025-04-01 21:44:20	Dismissed	197
15	DSP-0014	Meter Malfunction	CIT-00020	YCA3164	2025-02-11 12:08:38	Reduced	64
16	DSP-0015	Citation Dismissal	CIT-00021	PAN2146	2025-04-10 08:16:43	Dismissed	177
17	DSP-0016	Permit Not Recognized	CIT-00043	VOX7422	2025-04-11 08:09:04	Resolved – Upheld	112
18	DSP-0017	Wrong Location	CIT-00088	OQJ1557	2025-06-05 20:22:16	Resolved – Upheld	157
19	DSP-0018	Incorrect Vehicle	CIT-00092	HVN4472	2025-06-01 21:13:10	Resolved – Upheld	77
20	DSP-0019	Fine Reduction	CIT-00114	NZB4837	2025-09-21 14:52:39	Resolved – Upheld	108
21	DSP-0020	Incorrect Vehicle	CIT-00151	FFL0364	2025-06-06 11:09:55	Reduced	12
22	DSP-0021	Citation Dismissal	CIT-00159	QFX8026	2026-01-01 13:29:20	Under Review	0
23	DSP-0022	Permit Not Recognized	CIT-00160	OGT1378	2025-04-20 22:04:58	Resolved – Upheld	152
24	DSP-0023	Meter Malfunction	CIT-00175	MFZ3690	2025-10-09 14:29:40	Resolved – Upheld	119
25	DSP-0024	Meter Malfunction	CIT-00190	AWO9208	2025-12-31 19:01:00	Resolved – Upheld	121
26	DSP-0025	Permit Not Recognized	CIT-00201	MZU7575	2026-01-03 17:33:38	Resolved – Upheld	133
27	DSP-0026	Permit Not Recognized	CIT-00204	YWW3187	2025-04-19 15:52:58	Resolved – Upheld	47
28	DSP-0027	Fine Reduction	CIT-00216	VEL4624	2025-12-24 14:54:12	Resolved – Upheld	217
29	DSP-0028	Fine Reduction	CIT-00231	QIL5702	2025-12-21 12:36:48	Under Review	0
30	DSP-0029	Fine Reduction	CIT-00234	TSK0128	2025-12-24 18:53:29	Resolved – Upheld	80
31	DSP-0030	Fine Reduction	CIT-00254	GUL4995	2025-04-25 19:26:48	Dismissed	187
32	DSP-0031	Citation Dismissal	CIT-00260	MUS3875	2025-09-26 08:23:01	Resolved – Upheld	181
33	DSP-0032	Fine Reduction	CIT-00277	EIL2856	2025-09-08 13:14:44	Resolved – Upheld	98
34	DSP-0033	Wrong Location	CIT-00328	FVL3720	2025-03-20 13:53:22	Resolved – Upheld	122
35	DSP-0034	Citation Dismissal	CIT-00378	MZU7575	2025-03-09 06:09:21	Resolved – Upheld	166
36	DSP-0035	Meter Malfunction	CIT-00387	ONS9918	2025-04-13 12:15:13	Dismissed	102`;

async function run() {
  const pool = await poolPromise;
  
  // 1. Ensure columns exist
  const cols = ['dispute_type', 'license_number', 'dispute_datetime', 'dispute_status', 'resolution_time_hours'];
  for (let c of cols) {
    try {
      await pool.request().query(`
        IF NOT EXISTS (
          SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_NAME = 'disputes' AND COLUMN_NAME = '${c}'
        )
        BEGIN
          ALTER TABLE disputes ADD ${c} VARCHAR(255);
        END
      `);
    } catch (e) { console.log(e.message); }
  }

  // Convert resolution_time_hours to INT
  try {
    await pool.request().query(`ALTER TABLE disputes ALTER COLUMN resolution_time_hours INT;`);
  } catch(e) {}
  try {
    await pool.request().query(`ALTER TABLE disputes ALTER COLUMN dispute_datetime DATETIME;`);
  } catch(e) {}

  const rows = data.split('\n').map(l => l.split('\t'));
  for (let row of rows) {
    if (row.length < 8) continue;
    const [_, d_id, d_type, issue_num, lic_num, d_datetime, d_status, res_hours] = row;
    
    // Create vehicle if not exists
    try {
      await pool.request().query(`
        IF NOT EXISTS (SELECT 1 FROM vehicles WHERE license_number = '${lic_num}')
        BEGIN
          INSERT INTO vehicles (license_number, state, type, user_id) VALUES ('${lic_num}', 'XX', 'Sedan', 'USR-RANDOM');
        END
      `);
    } catch(e) {}

    // Create citation if not exists
    try {
      await pool.request().query(`
        IF NOT EXISTS (SELECT 1 FROM citations WHERE issue_number = '${issue_num}')
        BEGIN
          INSERT INTO citations (issue_number, license_number, violation_code, fine_amount, status, issue_datetime, officer_name)
          VALUES ('${issue_num}', '${lic_num}', '${d_type}', 50.00, 'Disputed', '${d_datetime}', 'System');
        END
      `);
    } catch(e) {}

    // Insert dispute
    try {
      await pool.request()
        .input('d_id', d_id)
        .input('issue_num', issue_num)
        .input('reason', d_type)
        .input('d_type', d_type)
        .input('lic_num', lic_num)
        .input('d_status', d_status)
        .input('d_datetime', d_datetime)
        .input('res_hours', res_hours)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM disputes WHERE dispute_id = @d_id)
          BEGIN
            INSERT INTO disputes (dispute_id, issue_number, reason, status, created_at, dispute_type, license_number, dispute_datetime, dispute_status, resolution_time_hours)
            VALUES (@d_id, @issue_num, @reason, 'Disputed', @d_datetime, @d_type, @lic_num, @d_datetime, @d_status, @res_hours);
          END
        `);
    } catch(e) { console.log(e.message); }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

run();
