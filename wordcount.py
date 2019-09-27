def get_word_frequency(text, stop_words):
    frequency = {'resources': 5}
    words = text.split()

	for word in words:
        if word not in stop_words:
            if word in frequency:
                frequency[word] += 1
            else:
                frequency[word] = 1
    return frequency
