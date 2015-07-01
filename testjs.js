/**
 * Created by Guillaume on 2015-07-01.
 */
**Youtube Video Background for Unbounce pages - Minified**

See full instructions here:
    https://getsatisfaction.com/unbounce/topics/how-can-i-create-a-youtube-video-background

        ```js
<script>

    // Youtube Video Background for Unbounce. V1.2

    // lpVideoBG('#SectionID', 'YoutubeVideoID', width, height, muted);
    // Use '#lp-pom-root' for a full page background

lpVideoBG('#lp-pom-block-9', '2XX5zDThC3U', 560, 315, 0);

function lpVideoBG(e,t,o,i,a){function n(){var t=$(e).width(),a=$(e).height();"#lp-pom-root"==e&&(a=$(window).height());var n=t/o,d=i*n;if(a>=d){var s=a/d;d=a*s}var p=d/i,y=o*p,c=(y-t)/2,u=(d-a)/2;$("#"+r)[0].setAttribute("height",d),$("#"+r)[0].setAttribute("width",y),$("#"+r).css({top:-u,left:-c,position:l})}var r="framedVideo-"+e.substr(1),d=e,l="fixed";"#lp-pom-root"!=e&&(d=e+" .lp-pom-block-content",l="absolute"),$(d).css({width:"100%","margin-left":"0",overflow:"hidden"}),$(d).append('<div style="height:100%;width:100%;position:absolute; top:0px"><iframe id="'+r+'" width="100%" height="100%" src="//www.youtube.com/embed/'+t+"?autoplay=1&controls=0&iv_load_policy=3&disablekb=1&fs=0&loop=1&modestbranding=1&rel=0&showinfo=0&playlist="+t+'&enablejsapi=1" frameborder="0" allowfullscreen style="display:block; visibility:hidden; "></iframe></div>'),$(d).append('<div style="height:100%;width:100%;position:absolute; top:0px"></div>'),$(e+"-color-overlay").appendTo(d),n(),$(window).resize(function(){n()});var s=onPlayerReady;onPlayerReady=function(e){s(e),y.setLoop(!0),1==a&&e.target.mute()};var p=onChangedState;onChangedState=function(e){p(e),e.data==YT.PlayerState.PLAYING?document.getElementById(r).style.visibility="visible":e.data==YT.PlayerState.ENDED&&(document.getElementById(r).style.visibility="hidden")};var y,c=onYouTubeIframeAPIReady;onYouTubeIframeAPIReady=function(){c(),y=new YT.Player(r,{loop:"1",events:{onReady:onPlayerReady,onStateChange:onChangedState}})}}function onYouTubeIframeAPIReady(){}function onPlayerReady(){}function onChangedState(){}var tag=document.createElement("script");tag.src="//www.youtube.com/iframe_api";var firstScriptTag=document.getElementsByTagName("script")[0];firstScriptTag.parentNode.insertBefore(tag,firstScriptTag);

</script>