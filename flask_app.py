from flask import Flask, render_template, request
import csv

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/students')
def students_grades():
    with open('kingdom_coder/static/grades.csv', mode='r') as file:
        csvfile = csv.reader(file)
        headers = next(csvfile)
        print(headers)
        content = []
        for rows in csvfile:
            content.append(rows)
    return render_template('students.html',heads =headers, rows=content)

@app.route('/matricula', methods=['GET', 'POST'])
def matricula():
    if request.method == 'POST':
        name = request.form['nombre']
        phone = request.form['telefono']
        address = request.form['direccion']
        studies = request.form['carrera']
        day = request.form['disponibilidad']

        with open('kingdom_coder/static/waiting.csv', mode='a', newline="") as file:
            csvfile = csv.writer(file)
            csvfile.writerow([name, phone, address, studies, day])
        print(name, phone, address, studies, day)
        return render_template("success.html")

    with open('kingdom_coder/static/matriculas.csv', mode='r') as file:
        csvfile = csv.reader(file)
        headers = next(csvfile)
        content = []
        for rows in csvfile:
            content.append(rows)

    with open('kingdom_coder/static/waiting.csv', mode='r') as wfile:
        csvwfile = csv.reader(wfile)
        _ = next(csvwfile)
        waiting = []
        for li in csvwfile:
            waiting.append(li)

    return render_template('matricula.html', heads=headers, rows =content, wlist=waiting  )
