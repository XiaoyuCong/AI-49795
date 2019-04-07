import pandas as pd

data = pd.read_csv('result.csv')
delete_list = []
num = int(data.describe().ix[0, 0])
for i in range(num):
    record = data.ix[i,:]
    if record['arousal'] == -2 or record['valence'] == -2:
        delete_list.append(i)

clear_data = data.drop(delete_list)
clear_data.to_csv('result2.csv')