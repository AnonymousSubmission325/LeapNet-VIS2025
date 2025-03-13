import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import KBinsDiscretizer

# Generate sample data
np.random.seed(0)
data = np.random.rand(100, 2)

# Convert the data to a dense matrix if it's sparse
if scipy.sparse.issparse(data):
    data = data.toarray()

# Define the number of bins in each dimension
n_bins = 10

# Create an instance of the KBinsDiscretizer class
discretizer = KBinsDiscretizer(n_bins=n_bins, strategy='uniform')

# Fit the discretizer to the data
discretizer.fit(data)

# Transform the data into binned data
binned_data = discretizer.transform(data)

# Plot the binned data
plt.hist2d(binned_data[:, 0], binned_data[:, 1], bins=n_bins, cmap='viridis')
plt.show()
