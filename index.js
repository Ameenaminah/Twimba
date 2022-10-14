import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
const tweetsDataFromLocalStorage = JSON.parse(
  localStorage.getItem("tweetsData")
);
if (tweetsDataFromLocalStorage) {
  tweetsDataFromLocalStorage;
  render();
}

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.text) {
    handleTextClick(e.target.dataset.text);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.btn) {
    replyBtnClick(e.target.dataset.btn);
    handleTextClick(e.target.dataset.btn);
  }
});
// EventListener Functions
function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  localStorage.setItem("tweetsData", JSON.stringify(tweetsData));
  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  localStorage.setItem("tweetsData", JSON.stringify(tweetsData));
  render();
}

function handleTextClick(textId) {
  document.getElementById(`replies-${textId}`).classList.toggle("hidden");
}

function replyBtnClick(tweetId) {
  const replyInput = document.getElementById(`reply-${tweetId}`);
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];
  if (replyInput.value && targetTweetObj.replies) {
    targetTweetObj.replies.push({
      handle: `mubo❤`,
      profilePic: `images/crypto-punk.png`,
      tweetText: replyInput.value,
    });
  }
  replyInput.value = "";
  localStorage.setItem("tweetsData", JSON.stringify(tweetsData));
  render();
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");
  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@Scrimba`,
      profilePic: `mypix.jpg`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
  }
  tweetInput.value = "";
  localStorage.setItem("tweetsData", JSON.stringify(tweetsData));
  render();
}

//  Adding to tht HTML
function getFeedHtml() {
  let feedHtml = ``;
  tweetsData.forEach(function (tweet) {
    let likeIconClass = "";
    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    let retweetIconClass = "";
    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    let repliesHtml = "";
    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
        <div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
    </div>
        `;
      });
    }

    feedHtml += `
  <div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text" data-text="${tweet.uuid}">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div  class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
        <input class="reply-input" id="reply-${tweet.uuid}" placeholder="Tweet your reply"></input>
        <button class="reply-btn" data-btn="${tweet.uuid}">Reply</button>
    </div>   
</div>
`;
  });
  return feedHtml;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}
render();
