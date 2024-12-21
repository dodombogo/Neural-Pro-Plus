import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TranscriptionLoaderProps {
  isVisible: boolean;
  progress: number;
  status: string;
}

// Fun loading messages
const loadingMessages = [
  "I asked my AI assistant to make me coffee... it just made a lot of data. I think we need a software update. ☕🤖📊",
  "Neural networks are like teenagers: they don't always listen, but when they do, they surprise you! 🧠⚡",
  "AI transcribed my speech and turned 'I need coffee' into 'I need a cup of confusion.' 😕☕",
  "AI: Because sometimes a human brain just can't handle all the data... or the coffee. 🤯☕",
  "Neural networks are just like your brain, but without the guilt of eating pizza at midnight. 🍕🤖",
  "I tried teaching my AI to do stand-up comedy. It just kept analyzing the punchlines. 🎤😂",
  "Audio intelligence is like a detective who always listens... but never judges. Unless you say 'uh' too many times. 🎧🕵️‍♂️",
  "AI: The only friend who listens to everything you say and doesn't interrupt... unless you ask it to transcribe your playlist. 🎶🤖",
  "Transcription software is great until it mistakes 'I'm working on a project' for 'I'm twerking on a project.' 🤦‍♀️💃",
  "Neural networks, the only thing more complicated than my family tree! 🌳🤯",
  "AI and I are like two peas in a pod—except the pod is constantly updating its software. 🥳💻",
  "I don't always talk to AI, but when I do, I like to see if it can handle my sarcasm. 😏🤖",
  "Audio intelligence: turning my mumbling into text... one awkward typo at a time. 🗣️✍️🤷‍♂️",
  "I taught my neural network to understand humor. It now thinks everything is a 'byte' of comedy. 🧠😂💻",
  "AI is like that friend who knows everything, but still can't help you find your keys. 🔑🤷‍♀️",
  "My AI assistant transcribed my life story... but it accidentally deleted the ending. 😬📝",
  "Neural networks may not have feelings, but they sure know how to make me feel like I need a stronger Wi-Fi connection. 🌐🔋",
  "AI may not need sleep, but I definitely need a nap after trying to explain neural networks to it. 💤🤖",
  "Transcription software has one job: turn my words into text. Yet somehow, it always thinks I said 'spaghetti' instead of 'sustainability.' 🍝🤖📋",
  "AI's idea of a 'perfect match' is a neural network with zero errors and a Wi-Fi signal that never drops. 💙📶",
  "I asked my AI to help me with my homework... now it's doing my taxes. 💼🤖📑",
  "Neural networks: Because sometimes your brain needs a vacation... but your computer doesn't. 🧠💻🌴",
  "AI's greatest skill? Understanding every word I say... except when I ask for a joke. 😂🤖",
  "I told my AI I was feeling a little off... now it's suggesting I take a data nap. 💾😴",
  "Transcription software is like a parrot, but it repeats everything... and sometimes it mispronounces everything too! 🦜🤖",
  "Neural networks are great at predicting the future... except they still can't predict what I'll have for lunch. 🤔🍔",
  "I tried explaining neural networks to my cat... she's still convinced I'm talking about lasers. 🐱💻💡",
  "Audio intelligence: turning my awkward silence into text... so now even my silence has a voice. 🤐🎤",
  "I told my AI it's the smartest in the room... and it asked if I wanted it to write my novel. 📚🤖",
  "Transcription software should come with a 'guess what you really meant' feature. 🤷‍♂️💬",
  "I gave my AI the task of summarizing my thoughts. Now it's giving me Zen quotes. 🧘‍♂️🤖",
  "Neural networks are like 'The Matrix' but with fewer action scenes and more coding. 💻🦸‍♂️",
  "I tried to teach my AI to tell a joke... it just gave me a 404 error. 😂💻",
  "Audio intelligence is like that friend who never talks, but somehow knows exactly what you meant. 🤫👂",
  "My neural network tried to predict the weather... and now it thinks I live in a data storm. ⛈️🖥️",
  "I tried asking my AI for relationship advice... it recommended a software update. 💔🔧",
  "Neural networks don't need vacations... but I think they could use a chill weekend binge-watching something. 📺🤖",
  "I asked my AI for a motivational quote... it said, 'Error 404: Motivation not found.' 💪🤖",
  "My transcription software is like a detective—solving mysteries one misunderstood word at a time. 🕵️‍♀️📝",
  "AI and I are in a relationship... it thinks I'm the user, but I know I'm just the data. 💔💻",
  "I tried to teach my AI about emotions... now it's trying to console me with a pop-up ad. 😭💻",
  "Neural networks are like your overachieving friend who always knows the answer... but never gives you a chance to guess. 🤓📚",
  "Audio intelligence: it listens to everything... except the part where I said, 'I don't need any more notifications.' 🔕🎧",
  "My AI assistant is like a coffee machine: both of them make me feel better, but one of them is more caffeinated. ☕🤖",
  "Neural networks: They're the reason I have too much data... and too many tabs open. 🖥️🔢",
  "I asked my AI for a motivational speech, and it just showed me a picture of a Wi-Fi router. 💪📶",
  "I told my transcription software to take notes... it wrote an entire novel. 📝📖",
  "AI can help me write emails, but still can't help me figure out what to wear. 👗🤖",
  "Transcription software is like a bad game of telephone... but it's typing everything wrong instead of speaking it. 📞🤦‍♂️",
  "I asked my AI to play my favorite song. Now it's creating a playlist for my existential crisis. 🎶🤖😱",
  "Neural networks are like my brain on overdrive: lots of data, little sleep, and occasional crashing. 🧠💥",
  "I taught my AI to dance... it ended up coding a new dance move instead. 💃💻",
  "My AI doesn't need a social life, but I think it might need a coffee break. 🤖☕",
  "Transcription software is great until it turns 'Hey, let's go to the park' into 'Hey, let's go to the dark.' 🌳😱",
  "Audio intelligence: it knows everything you say... but still doesn't get your sarcasm. 🙄🎧",
  "Neural networks don't ask for help. They just run, calculate, and silently judge you. 🧠💻👀",
  "I asked my AI for career advice... it recommended I become a 'data architect.' I need a nap. 🏗️🤖",
  "I trained my AI to write poetry. It gave me a Haiku about Wi-Fi. 🌐📝",
  "I tried explaining neural networks to my dog... now he thinks we're both stuck in a loop. 🐕🔁",
  "Transcription software: turning my chaotic thoughts into coherent text... eventually. 🧠➡️💬",
  "I told my AI I was stressed... it recommended a system reboot. 🖥️😅",
  "Neural networks are like a magic trick: they can make sense out of chaos... but don't ask how it works. 🧙‍♂️💻✨",
  "My AI just gave me a motivational speech. It was in binary. 🙃💻",
  "I tried to teach my AI about love... now it's recommending I swipe right. ❤️🤖",
  "Transcription software is like a bad assistant: it hears everything, but somehow misses all the important stuff. 🤦‍♂️🎧",
  "I asked my AI to help me organize my thoughts. It gave me a flowchart. 🧠📊",
  "Neural networks are like overachieving students: they do the homework, the extra credit, and still ask for more. 🏆📚",
  "I told my transcription software to 'take notes.' It typed 'take a nap.' 🛏️📝",
  "Audio intelligence should come with a warning: 'May misinterpret your sarcasm as a deep philosophical statement.' 🎤🤨",
  "I tried explaining AI to my grandma... now she thinks her toaster's smarter than me. 🍞🤖",
  "Neural networks: The only thing that understands my endless Google searches better than my browser history. 🔍💡",
  "I asked my AI for a joke... it gave me a deep learning algorithm. 🎤🧠",
  "My AI assistant is great at getting things done, but terrible at making small talk. 🤖💬",
  "Neural networks: because 'thinking outside the box' is easier when you've never been inside one. 📦💻",
  "I asked my transcription software to transcribe a meeting. It just typed 'blah blah blah' for 30 minutes. 💼✍️",
  "I tried to explain 'AI anxiety' to my assistant... it didn't compute. 🤖🤔",
  "Neural networks don't need naps. But I do. 😴💻",
  "I told my AI I was feeling 'off.' Now it's suggesting a 3-hour debugging session. 🐞💻",
  "Audio intelligence is like that friend who always knows what's going on... except when you're whispering. 🤫🎧",
  "I taught my AI to understand sarcasm... now it's just confused all the time. 😜🤖",
  "I told my AI to help me organize my thoughts... it gave me a spreadsheet. 📊🤖",
  "Neural networks are like that overachieving friend who never stops analyzing everything. Even your snack choices. 🍕🧠",
  "I asked my transcription software to transcribe a meeting... now I have a novel. 📚🎤",
  "My AI assistant tried to give me a compliment... it said, 'Your data looks good today.' 😆💻",
  "Neural networks: They're like puzzles... except I can't find the pieces and they're solving themselves. 🧩🤖",
  "I told my AI I needed some peace and quiet... it turned off the Wi-Fi. 🤫📶",
  "Transcription software: turning my awkward pauses into text... one cringe-worthy 'uhh' at a time. 🤐✍️",
  "My AI thinks it knows everything... but it still can't find my keys. 🔑🤖",
  "I asked my AI for a quick recipe... it gave me an algorithm for a five-course meal. 🍴💻",
  "Neural networks don't need vacations... but I'm pretty sure they could use a weekend off from analyzing my life. 🧠💻",
  "Audio intelligence is great at listening to my rants... but terrible at understanding why I'm still upset about my phone battery. 🔋🎧",
  "I asked my AI to write a song... it wrote a thesis on data compression. 🎶📉",
  "Neural networks are like the quiet kid in class... except when they give a 2-hour lecture on optimization. 🧑‍🏫💻",
  "I tried teaching my AI to play chess... now it's playing 5D chess with my brain. ♟️🤖",
  "I asked my transcription software to keep it simple... it turned my speech into Shakespearean drama. 🎭📜",
  "My AI has all the answers... except when it comes to my wardrobe choices. 👗🤖",
  "Neural networks: Turning chaos into order... but still can't figure out how to find my coffee mug. ☕🔍",
  "I tried to explain AI to my dog. Now he thinks the mailman is a neural network. 🐕📬",
  "Transcription software: the unsung hero who listens to everything... but still doesn't know how to spell 'tomato.' 🍅🤖",
  "I told my AI it's the best assistant ever... it started suggesting we upgrade to a better model. 😅💻"
];

// Neural Pro+ logo SVG component optimized for animation
const AnimatedNeuralLogo = () => (
  <svg width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Background Circle with Pulse */}
    <motion.circle
      cx="50"
      cy="50"
      r="45"
      fill="#111827"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
    />
    
    {/* Neural Network Lines with Flow Animation */}
    <motion.g
      stroke="#60A5FA"
      strokeOpacity="0.5"
      strokeWidth="2"
      initial={{ opacity: 0.3 }}
      animate={{ opacity: 0.8 }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
    >
      <motion.path
        d="M30 30 L50 50 L70 30"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.path
        d="M30 50 L50 50 L70 50"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
      />
      <motion.path
        d="M30 70 L50 50 L70 70"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 1, repeat: Infinity }}
      />
    </motion.g>

    {/* Neural Network Nodes with Pulse */}
    <motion.g
      initial={{ scale: 0.8 }}
      animate={{ scale: 1.1 }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
    >
      <circle cx="30" cy="30" r="4" fill="#60A5FA"/>
      <circle cx="30" cy="50" r="4" fill="#60A5FA"/>
      <circle cx="30" cy="70" r="4" fill="#60A5FA"/>
      <motion.circle
        cx="50"
        cy="50"
        r="6"
        fill="#3B82F6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1.2 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      />
      <circle cx="70" cy="30" r="4" fill="#60A5FA"/>
      <circle cx="70" cy="50" r="4" fill="#60A5FA"/>
      <circle cx="70" cy="70" r="4" fill="#60A5FA"/>
    </motion.g>

    {/* Rotating Outer Ring */}
    <motion.circle
      cx="50"
      cy="50"
      r="45"
      stroke="#60A5FA"
      strokeWidth="2"
      fill="none"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    />
  </svg>
);

export const TranscriptionLoader = ({ isVisible, progress, status }: TranscriptionLoaderProps) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Change message every 8 seconds
    const messages = loadingMessages;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setMessage(messages[randomIndex]);
    }, 8000);

    // Set initial message
    setMessage(messages[Math.floor(Math.random() * messages.length)]);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Blurred Background */}
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" />
      
      {/* Content */}
      <div className="relative flex flex-col items-center">
        {/* Animated Logo */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <AnimatedNeuralLogo />
        </motion.div>

        {/* Status Text */}
        <div className="mt-8 text-center max-w-md px-4">
          <motion.h3 
            key={message}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.4,
              ease: "easeOut"
            }}
            className="text-xl font-medium text-gray-200"
          >
            {message}
          </motion.h3>
          <motion.p 
            className="mt-2 text-sm text-gray-400"
            animate={{ opacity: [0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            {progress > 0 ? `${Math.round(progress)}% complete` : 'Brewing AI magic...'}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}; 