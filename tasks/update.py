import json

tasks = {}

file = "./wouldyourather/de.json"
out = "./wouldyourather/de.new.json"

with open(file) as json_file:
    data = json.load(json_file)
    counter = 0
    for task in data:
        datum = data[str(counter)]
        print(datum)
        tmp = {}
        tmp["question"] = datum["question"]
        tmp2 = {}
        for answer in datum["answers"]:
            tmp2[answer["id"]] = answer["answer"]
            print(answer)
        tmp["anwers"] = tmp2
        tasks[counter] = tmp
        counter += 1
    
print(tasks)
with open(out, "w") as outfile:
    json.dump(tasks, outfile, ensure_ascii=False, indent=4)
