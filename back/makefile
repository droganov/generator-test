# https://fastapi.tiangolo.com/contributing/?h=venv#virtual-environment-with-venv
# python -m venv env  # create virtual environment
freeze:
	pip freeze > requirements.txt

i:
	pip install -r requirements.txt

d:
	which pip
	uvicorn main:app --reload
	# env/bin/python -m uvicorn main:app --reload

pg-start:
	pg_ctl -s start

pg-stop:
	pg_ctl -s stop

test:
	pytest

typecheck:
	mypy --ignore-missing-imports .