"""사용: run.py <작업 폴더> <plain|skill> <프롬프트 키 번호>..."""
import json,subprocess,sys,time,shutil,pathlib
base=pathlib.Path(__file__).resolve().parent
work=pathlib.Path(sys.argv[1]);cond=sys.argv[2]
Q=json.load(open(base/'prompts.json',encoding='utf8'))
SKILL=pathlib.Path.home()/'.claude/skills/ui-ux-pro-max'
for n in sys.argv[3:]:
    k=next(x for x in Q if x.startswith(n+'-'))
    d=work/f'{cond}-{n}';d.mkdir(parents=True,exist_ok=True)
    if cond=='skill' and not (d/'.claude/skills/ui-ux-pro-max').exists():
        shutil.copytree(SKILL,d/'.claude/skills/ui-ux-pro-max',ignore=shutil.ignore_patterns('__pycache__','tests'))
    p=Q[k]
    if cond=='skill':p='/ui-ux-pro-max\n'+p
    c=['claude','-p',p,'--model','claude-opus-5-5','--effort','high','--output-format','stream-json','--verbose','--no-session-persistence','--setting-sources','project',
       '--allowedTools','Write,Read,Skill,Bash(python:*),Bash(python3:*),Bash(ls:*)','--disallowedTools','WebSearch,WebFetch,Agent,NotebookEdit,TodoWrite,Edit']
    t=time.time();r=subprocess.run(c,cwd=d,capture_output=True,text=True,stdin=subprocess.DEVNULL)
    (d/'stream.jsonl').write_text(r.stdout,encoding='utf8');(d/'stderr.txt').write_text(r.stderr,encoding='utf8')
    (d/'seconds.txt').write_text(str(round(time.time()-t)))
    print(cond,n,r.returncode,round(time.time()-t),(d/'index.html').exists(),flush=True)
