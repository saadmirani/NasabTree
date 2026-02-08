#!/usr/bin/env python3
import json
import os
import itertools

path = os.path.join('src','data','simla.json')
bak = path + '.bak'

with open(path, 'r', encoding='utf-8') as f:
    original = f.read()
    data = json.loads(original)

# Backup original if not exists
if not os.path.exists(bak):
    with open(bak, 'w', encoding='utf-8') as bf:
        bf.write(original)

counter = itertools.count(1)

def traverse(obj, parent_key=None):
    if isinstance(obj, dict):
        # If this dict is a spouse (stored under the 'spouse' key), remove any id and skip assigning one
        if parent_key == 'spouse':
            if 'id' in obj:
                del obj['id']
        else:
            # Heuristic for a person object: has a name and at least one person-related field
            is_person = 'name' in obj and any(k in obj for k in ('gender','children','dob','place'))
            if is_person:
                obj['id'] = f"p{next(counter):02d}"
        for k, v in list(obj.items()):
            traverse(v, parent_key=k)
    elif isinstance(obj, list):
        for item in obj:
            traverse(item, parent_key=None)

traverse(data)

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=3, ensure_ascii=False)

print('Renumbered IDs in', path)
print('Assigned', (next(counter)-1), 'IDs')
