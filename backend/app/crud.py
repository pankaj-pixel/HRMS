from sqlalchemy.orm import Session
from fastapi import HTTPException
from . import models, schemas

# ---------- Employees ----------

def create_employee(db: Session, employee: schemas.EmployeeCreate):
    existing = db.query(models.Employee).filter(
        (models.Employee.employee_id == employee.employee_id) |
        (models.Employee.email == employee.email)
    ).first()

    if existing:
        raise HTTPException(status_code=409, detail="Employee already exists")

    emp = models.Employee(**employee.dict())
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp


def get_employees(db: Session):
    return db.query(models.Employee).all()


def delete_employee(db: Session, emp_id: int):
    emp = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    db.delete(emp)
    db.commit()


# ---------- Attendance ----------


def mark_attendance(db: Session, data: schemas.AttendanceCreate):
    # Check if employee exists
    emp = db.query(models.Employee).filter(models.Employee.id == data.employee_id).first()
    if not emp:
        return {"success": False, "message": "Employee not found"}

    # Check for duplicate attendance
    existing = db.query(models.Attendance).filter(
        models.Attendance.employee_id == data.employee_id,
        models.Attendance.date == data.date
    ).first()
    if existing:
        return {"success": False, "message": "Attendance already marked for this employee on this date"}

    # Create new attendance record
    record = models.Attendance(
        employee_id=data.employee_id,
        date=data.date,
        status=data.status
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {"success": True, "message": "Attendance marked successfully"}





def get_attendance(db: Session, employee_id: int):
    return db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id
    ).all()
