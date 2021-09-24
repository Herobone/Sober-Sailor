import json

tasks = {}

file = "./whowouldrather/de.json"

with open(file) as json_file:
    data = json.load(json_file)
    counter = 0
    for task in data:
        tasks[str(counter)] = task
        counter += 1
    
with open(file, "w") as outfile:
    json.dump(tasks, outfile, ensure_ascii=False, indent=4)
