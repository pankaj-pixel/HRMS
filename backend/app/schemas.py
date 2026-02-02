from pydantic import BaseModel, EmailStr
from datetime import date

class EmployeeCreate(BaseModel):
    employee_id: str
    name: str
    email: EmailStr
    department: str


class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    name: str
    email: str
    department: str

    class Config:
        orm_mode = True


class AttendanceCreate(BaseModel):
    employee_id: int
    date: date
    status: str


class AttendanceResponse(BaseModel):
    date: date
    status: str

    class Config:
        orm_mode = True
