# Random Forest Regression without standardization
# 1. Import libraries and modules
import numpy as np
import pandas as pd
import sys
 
from sklearn.model_selection import train_test_split
from sklearn import preprocessing
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.externals import joblib 




# API call
def calculateVA(anger,contempt,disgust,fear,happiness,neutral,sadness,surprise):
    d = {'anger': [anger],'contempt': [contempt],'disgust': [disgust],'fear': [fear],
         'happiness': [happiness], 'neutral': [neutral], 'sadness': [sadness], 'surprise': [surprise]}
    df2 = pd.DataFrame(data=d)
    pred = rf.predict(df2)
    print(pred)
    return pred

data = pd.read_csv("result.csv")
data.head()


y = data[['arousal', 'valence']]
X = data.drop(['arousal', 'valence'], axis=1)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=4)

# 2. Declare data preprocessing steps
max_depth = 30
pipeline = make_pipeline(RandomForestRegressor(n_estimators=50,max_depth=max_depth, random_state=4))
# rf = RandomForestRegressor(n_estimators=10, max_depth=max_depth, random_state=2)

# 3. Declare hyperparameters to tune
hyperparameters = { 'randomforestregressor__max_features' : ['auto', 'sqrt', 'log2'],
                  'randomforestregressor__max_depth': [None, 5, 3, 1]}

# 4. Tune model using cross-validation pipeline
rf = GridSearchCV(pipeline, hyperparameters, cv=5)

rf.fit(X_train, y_train)

# 5. check the model performance
pred = rf.predict(X_test)
# print(pred)
# print(r2_score(y_test, pred))
# print(mean_squared_error(y_test, pred))

# 6. test one
# d = {'anger': [0], 'contempt': [0], 'disgust': [0.1], 'fear': [1], 
#      'happiness': [1], 'neutral': [0], 'sadness': [0], 'suprise': [0]}
# df2 = pd.DataFrame(data=d)
# pred = clf.predict(df2)
# print(pred)
calculateVA(float(sys.argv[1]),float(sys.argv[2]),float(sys.argv[3]),float(sys.argv[4]),float(sys.argv[5]),float(sys.argv[6]),float(sys.argv[7]),float(sys.argv[8]))
