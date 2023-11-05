import pandas as pd
import matplotlib.pyplot as plt

# Load the CSV data into a DataFrame
df = pd.read_csv('results.csv')

# Plotting the data
plt.figure(figsize=(10, 5))

# Plot each set of data with a distinct line
plt.plot(df['DataSize'], df['PersistentWriteTime'], label='Persistent Write Time', marker='o')
plt.plot(df['DataSize'], df['PersistentReadTime'], label='Persistent Read Time', marker='o')
plt.plot(df['DataSize'], df['VolatileWriteTime'], label='Volatile Write Time', marker='o')
plt.plot(df['DataSize'], df['VolatileReadTime'], label='Volatile Read Time', marker='o')

# Adding titles and labels
plt.title('MongoDB Read/Write Performance')
plt.xlabel('Data Size (bytes)')
plt.ylabel('Time (milliseconds)')
plt.legend()

# Adding grid
plt.grid(True)

# Show the plot
plt.tight_layout()
plt.savefig("results.png")
plt.show()