// Nilai FK untuk setiap kategori
const fkValues = {
    "Tidak Pasti": 0,
    "Hampir Tidak Pasti": 0.2,
    "Kemungkinan Besar Tidak": 0.3,
    "Mungkin Tidak": 0.4,
    "Kemungkinan Kecil": 0.5,
    "Mungkin": 0.6,
    "Kemungkinan Besar": 0.7,
    "Hampir Pasti": 0.8,
    "Pasti": 1
};

// Gejala
const gejala = [
    "G01 Perubahan Nafsu Makan", 
    "G02 Gangguan Tidur", 
    "G03 Bicara/bergerak lebih lambat",
    "G04 Kehilangan Kepercayaan Diri", 
    "G05 Merasa bersalah pada diri sendiri",
    "G06 Berniat menyakiti diri sendiri / bunuh diri", 
    "G07 Sering Merasa Sedih",
    "G08 Dada berdebar", 
    "G09 Sulit bernafas", 
    "G10 Merasa tercekik",
    "G11 Nyeri dan sesak di dada", 
    "G12 Mual dan gangguan perut", 
    "G13 Pusing/sakit kepala",
    "G14 Rasa takut dan khawatir berlebih", 
    "G15 Mudah tersinggung/curiga",
    "G16 Sulit konsentrasi", 
    "G17 Halusinasi", 
    "G18 Kurang bersosialisasi",
    "G19 Delusi", 
    "G20 Bicara yang tidak masuk akal", 
    "G21 Terlalu percaya diri",
    "G22 Bicara cepat dan berganti-ganti topik", 
    "G23 Gelisah dan mudah marah",
    "G24 Penurunan kemampuan berperilaku", 
    "G25 Diam membisu/ekspresi datar", 
    "G26 Senang berlebih"
];


// Rules untuk diagnosa dan CF
const rules = {
    "R1": { conditions: [0, 1, 2, 3, 4, 5, 6, 15], diagnosis: "P01", cf: 0.81 },
    "R2": { conditions: [0, 1, 2, 3, 4, 5, 6, 14, 15, 17], diagnosis: "P01", cf: 0.79 },
    "R3": { conditions: [1, 7, 8, 9, 10, 11, 12, 13], diagnosis: "P02", cf: 0.85 },
    "R4": { conditions: [1, 16, 17, 18, 19, 22, 23, 25], diagnosis: "P03", cf: 0.93 },
    "R5": { conditions: [2, 15, 17, 19, 23, 24], diagnosis: "P03", cf: 0.90 },
    "R6": { conditions: [2, 16, 18, 19, 23], diagnosis: "P03", cf: 0.96 },
    "R7": { conditions: [2, 17, 19, 23, 24], diagnosis: "P03", cf: 0.92 },
    "R8": { conditions: [1, 4, 6, 14, 15, 17, 19, 20, 22, 25], diagnosis: "P04", cf: 0.78 },
    "R9": { conditions: [1, 4, 6, 14, 15, 23, 25], diagnosis: "P04", cf: 0.83 }
};

// Diagnosa
const diagnosa = {
    "P01": "Gangguan Depresi",
    "P02": "Gangguan Kecemasan Menyeluruh",
    "P03": "Skizofrenia",
    "P04": "Gangguan Bipolar"
};

const gejalaContainer = document.getElementById('gejala-container');
const resultContainer = document.getElementById('result-container');

// Menambahkan gejala ke tampilan
gejala.forEach((g, index) => {
    const row = document.createElement('div');
    row.className = 'gejala-row';

    const label = document.createElement('label');
    label.textContent = g;

    const select = document.createElement('select');
    Object.keys(fkValues).forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });

    row.appendChild(label);
    row.appendChild(select);
    gejalaContainer.appendChild(row);
});

// Fungsi untuk menghitung FKCombine dan diagnosa
function calculateFKCombine(fkList, cfRule) {
    const minFk = Math.min(...fkList);
    return minFk * cfRule;
}

function calculateFinalFK(fkCombineList) {
    // Pastikan bahwa FKCombine terakumulasi dengan benar
    return fkCombineList.reduce((acc, fk) => acc + (fk * (1 - acc)), 0);
}


document.getElementById('diagnosa-btn').onclick = function() {
    const selectedFK = Array.from(gejalaContainer.querySelectorAll('select')).map(select => select.value);
    const fkCombineList = [];
    const resultDiagnosa = [];
    const rulesAchieved = [];

    for (const [rule, { conditions, diagnosis, cf }] of Object.entries(rules)) {
        const fkValuesList = conditions.map(c => fkValues[selectedFK[c]]);
        if (fkValuesList.every(fk => fk > 0)) {
            const fkCombine = calculateFKCombine(fkValuesList, cf);
            fkCombineList.push(fkCombine);
            resultDiagnosa.push(`${diagnosa[diagnosis]}: ${fkCombine.toFixed(2)}`);
            rulesAchieved.push(rule);
        }
    }

    if (fkCombineList.length > 0) {
        const finalFK = calculateFinalFK(fkCombineList);
        resultContainer.innerHTML = `Hasil Diagnosa:<br>${resultDiagnosa.join('<br>')}<br><br>FKCombine: ${(finalFK * 100).toFixed(2)}%<br>Fakta Rules: ${rulesAchieved.join(', ')}`;
    } else {
        resultContainer.textContent = "Tidak ada diagnosa yang sesuai.";
    }
};

// Fungsi untuk mereset pilihan
document.getElementById('reset-btn').onclick = function() {
    gejalaContainer.querySelectorAll('select').forEach(select => select.value = "Tidak Pasti");
    resultContainer.textContent = "";
};
