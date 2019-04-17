import numpy as np
import pandas as pd
import sys

import pickle

from sklearn.model_selection import train_test_split
from sklearn import preprocessing
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.externals import joblib



def calculateVA(anger,contempt,disgust,fear,happiness,neutral,sadness,surprise):
    d = {'anger': [anger],'contempt': [contempt],'disgust': [disgust],'fear': [fear],
         'happiness': [happiness], 'neutral': [neutral], 'sadness': [sadness], 'surprise': [surprise]}
    df2 = pd.DataFrame(data=d)
    pred = rf.predict(df2)
    print(pred)
    return pred

filename = 'model.sav'
rf = pickle.load(open(filename, 'rb'))

calculateVA(float(sys.argv[1]),float(sys.argv[2]),float(sys.argv[3]),float(sys.argv[4]),float(sys.argv[5]),float(sys.argv[6]),float(sys.argv[7]),float(sys.argv[8]))