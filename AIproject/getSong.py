import pandas as pd
import sys


#print(data.info())

#get a song from music.csv based on picture_valence and picture_arsoual
#return : the title of the song
def get_song(picture_valence, picture_arousal):
    result = {}

    picture_valence = picture_valence * 5 + 5
    picture_arousal = picture_arousal * 5 + 5
    data = pd.read_csv('music.csv')
    num = data.shape[0]
    #min_diff = 100

    for i in range(5):
        record = data.iloc[i]
        diff = abs(picture_valence - record['valence_mean']) + abs(picture_arousal - record['arousal_mean'])
        result[record['Song title']] = (diff,record['Artist'])
    #song_title = ""
    for i in range(5,num):
        record = data.iloc[i]
        diff = abs(picture_valence - record['valence_mean']) + abs(picture_arousal - record['arousal_mean'])
        max_song = list(result.keys())[0]
        max_diff = result[max_song][0]
        for song in result:
            if result[song][0] > max_diff:
                max_song = song
                max_diff = result[song][0]
        #print(len(result))
        if diff < max_diff:
            del result[max_song]
            result[record['Song title']] = (diff, record['Artist'])
    #print(result)
    result_string = ""
    for song in result:
        result_string += song + '-' + result[song][1]+'/'
    print(result_string)
    #print(song_title)
    return  result_string


get_song(float(sys.argv[1]),float(sys.argv[2]))


