from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .database import SessionLocal
from . import crud, schemas

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/employees", response_model=schemas.EmployeeResponse, status_code=201)
def add_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    return crud.create_employee(db, employee)


@router.get("/employees", response_model=list[schemas.EmployeeResponse])
def list_employees(db: Session = Depends(get_db)):
    return crud.get_employees(db)


@router.delete("/employees/{emp_id}", status_code=204)
def remove_employee(emp_id: int, db: Session = Depends(get_db)):
    crud.delete_employee(db, emp_id)


@router.post("/attendance", status_code=201)
def create_attendance(data: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    return crud.mark_attendance(db, data)


@router.get("/attendance/{employee_id}", response_model=list[schemas.AttendanceResponse])
def view_attendance(employee_id: int, db: Session = Depends(get_db)):
    return crud.get_attendance(db, employee_id)
