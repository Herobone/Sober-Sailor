import json

tasks = {}

file = "./wouldyourather/tr.json"
out = "./wouldyourather/tr.new.json"

with open(file) as json_file:
    data = json.load(json_file)
    counter = 0
    for task in data:
        datum = data[str(counter)]
        print(datum)
        tmp = {}
        tmp["question"] = datum["question"]
        tmp2 = {}
        count2 = 0
        for answer in datum["answers"]:
            tmp2[count2] = answer["answer"]
            print(answer)
            count2 += 1
        tmp["anwers"] = tmp2
        tasks[counter] = tmp
        counter += 1
    
print(tasks)
with open(out, "w") as outfile:
    json.dump(tasks, outfile, ensure_ascii=False, indent=4)
