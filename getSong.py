import pandas as pd
import sys


#print(data.info())

#get a song from music.csv based on picture_valence and picture_arsoual
#return : the title of the song
def get_song(picture_valence, picture_arousal):
    data = pd.read_csv('music.csv')
    num = int(data.describe().ix[0, 0])
    min_diff = 10
    song_title = ""
    for i in range(num):
        record = data.ix[i, :]
        diff = abs(picture_valence - record['valence_mean']) + abs(picture_arousal - record['arousal_mean'])
        if min_diff > diff:
            min_diff = diff
            song_title = record['Song title']

    print(song_title)
    return  song_title

get_song(float(sys.argv[1]),float(sys.argv[2]))


