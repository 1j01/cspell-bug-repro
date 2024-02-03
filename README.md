# CSpell Bug Reproduction

To reproduce the bug, run:

```bash
npm i
npm run spellcheck
```

Error output should look similar to the following:

```
$ npm run spellcheck

> cspell-bug-repro@0.0.0 spellcheck
> cspell-cli lint .

TypeError: Cannot read properties of undefined (reading '0')
    at new FastTrieBlobINode (node_modules/cspell-trie-lib/dist/lib/TrieBlob/FastTrieBlobIRoot.js:17:27)
    at FastTrieBlobINode.child (node_modules/cspell-trie-lib/dist/lib/TrieBlob/FastTrieBlobIRoot.js:77:16)
    at nodeWalker (node_modules/cspell-trie-lib/dist/lib/ITrieNode/walker/walker.js:58:30)
    at nodeWalker.next (<anonymous>)
    at get size [as size] (node_modules/cspell-dictionary/dist/SpellingDictionary/SpellingDictionaryFromTrie.js:43:51)      
    at node_modules/cspell-dictionary/dist/SpellingDictionary/SpellingDictionaryCollection.js:21:64
    at Array.sort (<anonymous>)
    at new SpellingDictionaryCollectionImpl (node_modules/cspell-dictionary/dist/SpellingDictionary/SpellingDictionaryCollection.js:21:47)
    at createCollection (node_modules/cspell-dictionary/dist/SpellingDictionary/SpellingDictionaryCollection.js:98:12)      
    at _getDictionaryInternal (node_modules/cspell-lib/dist/esm/SpellingDictionary/Dictionaries.js:50:12)
```

I have trimmed the dictionary file by brute force, cycling through the list and removing words as long as the error persisted.
(See `trim.js`)

Also note that in VS Code, with the Code Spell Checker extension installed, a few words are reported as misspelled when viewing the dictionary file.

Before trimming the dictionary file, the following words were reported as misspelled:

- datetime
- desaturated
- divs
- djvu
- documentedly
- ᐊᓂᔑᓈᐯᒧᐎᓐ
- ᓀᐦᐃᔭᐍᐏᐣ

Of these, when viewing this readme file, "datetime" was not considered misspelled, but the rest were.

Now, after trimming, only one word is reported as misspelled in the dictionary file:
- ᓀᐦᐃᔭᐍᐏᐣ
