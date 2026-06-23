import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldAlert, CheckCircle, Upload, Search, Calendar, ChevronRight, UserCheck } from 'lucide-react';
import { API_URL } from '../config';

export default function Admissions() {
  const location = useLocation();

  // Multi-step form state
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    student_name: '',
    dob: '',
    gender: '',
    blood_group: '',
    admission_class: '',
    parent_name: '',
    email: '',
    phone: '',
    address: '',
    previous_school: ''
  });
  
  const [photoFile, setPhotoFile] = useState(null);
  const [aadharFile, setAadharFile] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Status check state
  const [statusQuery, setStatusQuery] = useState('');
  const [statusResult, setStatusResult] = useState(null);
  const [statusError, setStatusError] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Scroll to hash elements if any (e.g. #fee-structure)
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (fileType === 'photo') {
      setPhotoFile(file);
    } else if (fileType === 'aadhar') {
      setAadharFile(file);
    }
  };

  const nextStep = () => {
    // Basic validation before going to next step
    if (step === 1) {
      if (!formData.student_name || !formData.dob || !formData.gender || !formData.admission_class) {
        alert('Please fill out all required student details.');
        return;
      }
    } else if (step === 2) {
      if (!formData.parent_name || !formData.email || !formData.phone || !formData.address) {
        alert('Please fill out all required parent contact details.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photoFile || !aadharFile) {
      alert('Please upload both the Student Photo and Aadhar Card files.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const data = new FormData();
    // Append textual fields
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    // Append files
    data.append('photo', photoFile);
    data.append('aadhar', aadharFile);

    try {
      const response = await fetch(`${API_URL}/admissions/register`, {
        method: 'POST',
        body: data
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit admission application.');
      }

      setSubmitResult(result);
      setStep(5); // Go to success step
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status Checking
  const handleCheckStatus = async (e) => {
    e.preventDefault();
    if (!statusQuery.trim()) return;

    setIsCheckingStatus(true);
    setStatusError(null);
    setStatusResult(null);

    try {
      const response = await fetch(`${API_URL}/admissions/status?query=${encodeURIComponent(statusQuery)}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'No records found.');
      }

      setStatusResult(result);
    } catch (err) {
      setStatusError(err.message);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      student_name: '',
      dob: '',
      gender: '',
      blood_group: '',
      admission_class: '',
      parent_name: '',
      email: '',
      phone: '',
      address: '',
      previous_school: ''
    });
    setPhotoFile(null);
    setAadharFile(null);
    setSubmitResult(null);
    setSubmitError(null);
  };

  return (
    <div className="admissions-page-container animate-fade-in">
      {/* Banner */}
      <div className="admissions-banner-header" style={{ backgroundImage: `linear-gradient(rgba(13, 92, 52, 0.82), rgba(7, 59, 33, 0.9)), url(/sports.png)` }}>
        <div className="container banner-inner">
          <h1>Admission Portal</h1>
          <p>Online registration, guidelines, fee structures, and application tracking.</p>
        </div>
      </div>

      {/* Procedure Section */}
      <section className="section-padding container">
        <div className="section-header">
          <h2>Admission Procedure</h2>
          <p>Our enrollment workflow is designed to be transparent and straightforward.</p>
        </div>
        
        <div className="procedure-steps-row">
          <div className="step-box">
            <div className="step-num">01</div>
            <h4>Registration</h4>
            <p>Fill out the online application form below and upload student photo and Aadhar card.</p>
          </div>
          <div className="step-box">
            <div className="step-num">02</div>
            <h4>Verification</h4>
            <p>Academic committee reviews documents and verifies the details provided.</p>
          </div>
          <div className="step-box">
            <div className="step-num">03</div>
            <h4>Interaction</h4>
            <p>General interaction with student and parents at campus (or virtually).</p>
          </div>
          <div className="step-box">
            <div className="step-num">04</div>
            <h4>Fees & Roll</h4>
            <p>Upon selection, pay admission fee to confirm enrollment and receive roll number.</p>
          </div>
        </div>
      </section>

      {/* Fee Structure */}
      <section id="fee-structure" className="fee-structure-section section-padding">
        <div className="container">
          <div className="section-header">
            <h2>School Fee Structure</h2>
            <p>Annual academic fee breakdown for the academic year 2026-27.</p>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Class Range</th>
                  <th>Admission Fee (One-Time)</th>
                  <th>Tuition Fee (Quarterly)</th>
                  <th>Development Fee (Annual)</th>
                  <th>Exam & Activities (Annual)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Nursery to Prep</td>
                  <td>₹15,000</td>
                  <td>₹12,500</td>
                  <td>₹8,000</td>
                  <td>₹4,500</td>
                </tr>
                <tr>
                  <td>Grade I to V</td>
                  <td>₹20,000</td>
                  <td>₹14,800</td>
                  <td>₹10,000</td>
                  <td>₹5,500</td>
                </tr>
                <tr>
                  <td>Grade VI to VIII</td>
                  <td>₹25,000</td>
                  <td>₹17,200</td>
                  <td>₹12,000</td>
                  <td>₹6,500</td>
                </tr>
                <tr>
                  <td>Grade IX to X</td>
                  <td>₹30,000</td>
                  <td>₹19,500</td>
                  <td>₹15,000</td>
                  <td>₹7,500</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="fee-disclaimer">*Note: Transport charges and hostel fees are computed separately based on route and room configurations.</p>
        </div>
      </section>

      {/* Registration Form Widget */}
      <section id="register-online" className="section-padding container">
        <div className="section-header">
          <h2>Online Registration Form</h2>
          <p>Complete this formal wizard to submit your student application.</p>
        </div>

        <div className="form-wizard-card premium-card">
          {/* Progress Indicator */}
          {step <= 4 && (
            <div className="wizard-progress-bar">
              <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                <span className="p-num">1</span>
                <span className="p-label">Student Details</span>
              </div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                <span className="p-num">2</span>
                <span className="p-label">Parent Details</span>
              </div>
              <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                <span className="p-num">3</span>
                <span className="p-label">Upload Files</span>
              </div>
              <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
                <span className="p-num">4</span>
                <span className="p-label">Preview & Submit</span>
              </div>
            </div>
          )}

          {/* Step 1: Student Details */}
          {step === 1 && (
            <div className="wizard-form-step">
              <h3 className="wizard-step-title">Step 1: Student Information</h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Student Full Name <span className="req">*</span></label>
                  <input type="text" name="student_name" value={formData.student_name} onChange={handleChange} placeholder="Enter full name" className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Date of Birth <span className="req">*</span></label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Gender <span className="req">*</span></label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="form-control" required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <select name="blood_group" value={formData.blood_group} onChange={handleChange} className="form-control">
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Admission Class <span className="req">*</span></label>
                  <select name="admission_class" value={formData.admission_class} onChange={handleChange} className="form-control" required>
                    <option value="">Select Target Class</option>
                    <option value="Nursery">Nursery</option>
                    <option value="Prep">Prep</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Previous School (If any)</label>
                  <input type="text" name="previous_school" value={formData.previous_school} onChange={handleChange} placeholder="Previous School name" className="form-control" />
                </div>
              </div>
              <div className="wizard-actions">
                <div></div>
                <button type="button" onClick={nextStep} className="btn btn-primary">Next Details <ChevronRight size={18} /></button>
              </div>
            </div>
          )}

          {/* Step 2: Parent Details */}
          {step === 2 && (
            <div className="wizard-form-step">
              <h3 className="wizard-step-title">Step 2: Parent / Guardian Information</h3>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Father/Mother Full Name <span className="req">*</span></label>
                  <input type="text" name="parent_name" value={formData.parent_name} onChange={handleChange} placeholder="Parent name" className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Email Address <span className="req">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@mail.com" className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Mobile Number <span className="req">*</span></label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit number" className="form-control" required />
                </div>
                <div className="form-group">
                  <label>Complete Address <span className="req">*</span></label>
                  <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Residential address" className="form-control" rows="3" required></textarea>
                </div>
              </div>
              <div className="wizard-actions">
                <button type="button" onClick={prevStep} className="btn btn-outline">Back</button>
                <button type="button" onClick={nextStep} className="btn btn-primary">Next: Uploads <ChevronRight size={18} /></button>
              </div>
            </div>
          )}

          {/* Step 3: File Uploads */}
          {step === 3 && (
            <div className="wizard-form-step">
              <h3 className="wizard-step-title">Step 3: Document Attachments</h3>
              <p className="upload-subtitle">Please upload clear scan copies of the following documents. Only JPG, PNG, or PDF formats up to 5MB are accepted.</p>
              
              <div className="uploads-stack">
                <div className="upload-box-card">
                  <div className="upload-icon-container">
                    <Upload size={32} className="upload-icon" />
                  </div>
                  <div className="upload-details">
                    <h4>Student Photograph <span className="req">*</span></h4>
                    <p>Passport-size photo of candidate. Clear face visible.</p>
                    <input type="file" accept="image/jpeg, image/png" onChange={(e) => handleFileChange(e, 'photo')} className="file-input-native" id="photo-upload" />
                    <label htmlFor="photo-upload" className="btn btn-outline file-btn">
                      {photoFile ? `Selected: ${photoFile.name.substring(0, 15)}...` : 'Select JPG/PNG Image'}
                    </label>
                  </div>
                </div>

                <div className="upload-box-card">
                  <div className="upload-icon-container">
                    <Upload size={32} className="upload-icon" />
                  </div>
                  <div className="upload-details">
                    <h4>Student Aadhar Card <span className="req">*</span></h4>
                    <p>Government issued UIDAI Aadhar card. PDF or image scans.</p>
                    <input type="file" accept="image/jpeg, image/png, application/pdf" onChange={(e) => handleFileChange(e, 'aadhar')} className="file-input-native" id="aadhar-upload" />
                    <label htmlFor="aadhar-upload" className="btn btn-outline file-btn">
                      {aadharFile ? `Selected: ${aadharFile.name.substring(0, 15)}...` : 'Select Image or PDF'}
                    </label>
                  </div>
                </div>
              </div>

              <div className="wizard-actions">
                <button type="button" onClick={prevStep} className="btn btn-outline">Back</button>
                <button type="button" onClick={nextStep} className="btn btn-primary">Review Details <ChevronRight size={18} /></button>
              </div>
            </div>
          )}

          {/* Step 4: Preview Details */}
          {step === 4 && (
            <div className="wizard-form-step">
              <h3 className="wizard-step-title">Step 4: Verify Application Details</h3>
              <p className="verify-subtitle">Review your entry before final submission. Errors cannot be edited online once submitted.</p>
              
              <div className="preview-grids-container">
                <div className="preview-sec">
                  <h4>Student Information</h4>
                  <p><strong>Name:</strong> {formData.student_name}</p>
                  <p><strong>DOB:</strong> {formData.dob}</p>
                  <p><strong>Gender:</strong> {formData.gender}</p>
                  <p><strong>Blood Group:</strong> {formData.blood_group || 'Not specified'}</p>
                  <p><strong>Admission Class:</strong> {formData.admission_class}</p>
                  <p><strong>Previous School:</strong> {formData.previous_school || 'N/A'}</p>
                </div>
                <div className="preview-sec">
                  <h4>Parent & Contact Info</h4>
                  <p><strong>Parent Name:</strong> {formData.parent_name}</p>
                  <p><strong>Email Address:</strong> {formData.email}</p>
                  <p><strong>Mobile Number:</strong> {formData.phone}</p>
                  <p><strong>Address:</strong> {formData.address}</p>
                </div>
                <div className="preview-sec full-width">
                  <h4>Uploaded Files</h4>
                  <p>📸 <strong>Student Photo:</strong> {photoFile ? photoFile.name : 'Missing'}</p>
                  <p>📄 <strong>Aadhar Card:</strong> {aadharFile ? aadharFile.name : 'Missing'}</p>
                </div>
              </div>

              {submitError && (
                <div className="submit-error-banner">
                  <ShieldAlert size={20} />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="wizard-actions">
                <button type="button" onClick={prevStep} className="btn btn-outline" disabled={isSubmitting}>Back</button>
                <button type="button" onClick={handleSubmit} className="btn btn-secondary" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting Form...' : 'Agree & Submit Form'}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Success Banner */}
          {step === 5 && submitResult && (
            <div className="wizard-form-step success-step-wrapper">
              <CheckCircle size={64} className="success-icon" />
              <h2>Registration Submitted Successfully!</h2>
              <p className="success-txt">Thank you for choosing ABC Public School. Your application has been logged into our database.</p>
              
              <div className="app-receipt-card">
                <p><strong>Candidate Name:</strong> {formData.student_name}</p>
                <p><strong>Admission Class:</strong> {formData.admission_class}</p>
                <p><strong>Registration Number:</strong> <span className="receipt-num">{submitResult.applicationNumber}</span></p>
                <p><strong>Submission Time:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
              </div>

              <div className="instruction-box-grey">
                <h5>What Happens Next?</h5>
                <p>1. Copy and save your **Registration Number** listed above.</p>
                <p>2. Our Academic Desk will verify the uploaded Photo and Aadhar card scans.</p>
                <p>3. You can track the approval status below in real time.</p>
              </div>

              <button type="button" onClick={resetForm} className="btn btn-primary">Submit Another Form</button>
            </div>
          )}
        </div>
      </section>

      {/* Application Status Tracker */}
      <section id="check-status" className="status-tracker-section section-padding">
        <div className="container status-tracker-wrapper">
          <div className="section-header">
            <h2>Track Application Status</h2>
            <p>Query your admission application details using Email, Mobile or Registration Number.</p>
          </div>

          <div className="tracker-card-layout">
            <form onSubmit={handleCheckStatus} className="status-search-form">
              <input 
                type="text" 
                placeholder="Registration No (e.g. ABCPS/2026/10001) or Email/Mobile" 
                value={statusQuery} 
                onChange={(e) => setStatusQuery(e.target.value)} 
                className="form-control"
                required
              />
              <button type="submit" className="btn btn-primary" disabled={isCheckingStatus}>
                <Search size={18} /> {isCheckingStatus ? 'Checking...' : 'Check Status'}
              </button>
            </form>

            {statusError && (
              <div className="status-error-panel">
                <ShieldAlert size={22} className="alert-red" />
                <div>
                  <h4>Application Not Found</h4>
                  <p>{statusError}</p>
                </div>
              </div>
            )}

            {statusResult && (
              <div className="status-results-panel animate-fade-in">
                <div className="status-header-flex">
                  <div>
                    <h3>{statusResult.student_name}</h3>
                    <p className="app-sub-id">Reg No: {statusResult.applicationNumber}</p>
                  </div>
                  <span className={`badge badge-${statusResult.status.toLowerCase()}`}>
                    Status: {statusResult.status}
                  </span>
                </div>
                <div className="status-detail-body">
                  <p><strong>Applying for:</strong> {statusResult.admission_class}</p>
                  <p><strong>Parent / Guardian:</strong> {statusResult.parent_name}</p>
                  <p><strong>Registration Date:</strong> {new Date(statusResult.created_at).toLocaleDateString()}</p>
                  
                  <div className="remarks-box-accent">
                    <h5>Official Remarks:</h5>
                    <p>{statusResult.admin_remarks}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .admissions-banner-header {
          background-size: cover;
          background-position: center;
          padding: 100px 0;
          color: var(--bg-white);
          text-align: center;
        }

        .banner-inner h1 {
          font-size: 3rem;
          color: var(--bg-white);
          margin-bottom: 15px;
        }

        .banner-inner p {
          font-size: 1.2rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Steps */
        .procedure-steps-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 25px;
          margin-top: 30px;
        }

        .step-box {
          background-color: var(--bg-white);
          padding: 30px;
          border-radius: var(--border-radius-md);
          border: 1px solid var(--border-color);
          position: relative;
          box-shadow: var(--shadow-sm);
        }

        .step-num {
          font-size: 2.5rem;
          font-weight: 800;
          color: rgba(13, 92, 52, 0.1);
          position: absolute;
          top: 15px;
          right: 20px;
          line-height: 1;
        }

        .step-box h4 {
          color: var(--primary-color);
          margin-bottom: 12px;
          font-size: 1.15rem;
        }

        .step-box p {
          color: var(--text-light);
          font-size: 0.88rem;
          line-height: 1.5;
        }

        .fee-structure-section {
          background-color: #f2f5f3;
        }

        .fee-disclaimer {
          font-size: 0.85rem;
          color: var(--text-light);
          margin-top: 15px;
          font-style: italic;
        }

        /* Wizard progress indicator */
        .wizard-progress-bar {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 25px;
          margin-bottom: 35px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .progress-step {
          display: flex;
          align-items: center;
          gap: 10px;
          opacity: 0.4;
          transition: var(--transition-fast);
        }

        .progress-step.active {
          opacity: 1;
        }

        .p-num {
          width: 32px;
          height: 32px;
          background-color: var(--primary-color);
          color: var(--bg-white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .progress-step:not(.active) .p-num {
          background-color: #bdc3c7;
        }

        .p-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--primary-dark);
        }

        .wizard-step-title {
          font-size: 1.3rem;
          margin-bottom: 25px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .req { color: var(--danger-color); }

        .wizard-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
          border-top: 1px solid var(--border-color);
          padding-top: 25px;
        }

        /* File Upload */
        .upload-subtitle {
          font-size: 0.95rem;
          color: var(--text-light);
          margin-bottom: 30px;
        }

        .uploads-stack {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .upload-box-card {
          display: flex;
          align-items: center;
          gap: 25px;
          background-color: var(--bg-light);
          border: 1px dashed #bdc3c7;
          border-radius: var(--border-radius-md);
          padding: 25px;
        }

        .upload-icon-container {
          background-color: rgba(13, 92, 52, 0.08);
          color: var(--primary-color);
          width: 70px;
          height: 70px;
          border-radius: var(--border-radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-details h4 {
          font-size: 1.1rem;
          margin-bottom: 5px;
        }

        .upload-details p {
          font-size: 0.85rem;
          color: var(--text-light);
          margin-bottom: 12px;
        }

        .file-input-native {
          display: none;
        }

        .file-btn {
          font-size: 0.85rem;
          padding: 8px 16px;
        }

        /* Preview Details */
        .verify-subtitle {
          font-size: 0.95rem;
          color: var(--text-light);
          margin-bottom: 25px;
        }

        .preview-grids-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
          background-color: var(--bg-light);
          padding: 30px;
          border-radius: var(--border-radius-md);
          border: 1px solid var(--border-color);
        }

        .preview-sec h4 {
          font-size: 1.05rem;
          border-bottom: 1px solid #bdc3c7;
          padding-bottom: 6px;
          margin-bottom: 12px;
        }

        .preview-sec p {
          font-size: 0.92rem;
          margin-bottom: 8px;
          color: var(--text-dark);
        }

        .preview-sec.full-width {
          grid-column: span 2;
        }

        .submit-error-banner {
          background-color: #fdf2e9;
          color: var(--danger-color);
          padding: 15px 20px;
          border-radius: var(--border-radius-sm);
          margin-top: 25px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          font-size: 0.92rem;
        }

        /* Success Card */
        .success-step-wrapper {
          text-align: center;
          padding: 30px 0;
        }

        .success-icon {
          color: var(--success-color);
          margin-bottom: 20px;
        }

        .success-txt {
          color: var(--text-light);
          margin-bottom: 30px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .app-receipt-card {
          background-color: #eaf2f8;
          border: 1px solid #aed6f1;
          border-radius: var(--border-radius-md);
          padding: 25px;
          max-width: 500px;
          margin: 0 auto 30px auto;
          text-align: left;
        }

        .app-receipt-card p {
          margin-bottom: 8px;
          font-size: 0.95rem;
        }

        .receipt-num {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--primary-color);
          font-family: monospace;
          background-color: var(--bg-white);
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid var(--border-color);
        }

        .instruction-box-grey {
          background-color: var(--bg-light);
          border-radius: var(--border-radius-sm);
          padding: 20px;
          max-width: 500px;
          margin: 0 auto 30px auto;
          text-align: left;
          font-size: 0.88rem;
          color: var(--text-light);
        }

        .instruction-box-grey h5 {
          font-size: 0.95rem;
          color: var(--primary-dark);
          margin-bottom: 10px;
        }

        .instruction-box-grey p {
          margin-bottom: 6px;
        }

        /* Tracker */
        .status-tracker-section {
          background-color: #f2f5f3;
        }

        .tracker-card-layout {
          max-width: 650px;
          margin: 0 auto;
          background-color: var(--bg-white);
          border-radius: var(--border-radius-md);
          box-shadow: var(--shadow-sm);
          padding: 35px;
          border: 1px solid var(--border-color);
        }

        .status-search-form {
          display: flex;
          gap: 15px;
          margin-bottom: 30px;
        }

        .status-search-form input {
          flex: 1;
        }

        .status-error-panel {
          background-color: #fdf2e9;
          border: 1px solid #fadbd8;
          border-radius: var(--border-radius-sm);
          padding: 20px;
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .alert-red { color: var(--danger-color); }
        .status-error-panel h4 { font-size: 1.05rem; }
        .status-error-panel p { font-size: 0.88rem; color: var(--text-light); }

        .status-results-panel {
          background-color: var(--bg-light);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          padding: 25px;
        }

        .status-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid #bdc3c7;
          padding-bottom: 15px;
          margin-bottom: 15px;
        }

        .app-sub-id {
          font-size: 0.85rem;
          color: var(--text-light);
          font-family: monospace;
          margin-top: 3px;
        }

        .status-detail-body p {
          margin-bottom: 8px;
          font-size: 0.95rem;
        }

        .remarks-box-accent {
          margin-top: 20px;
          background-color: var(--bg-white);
          border-radius: var(--border-radius-sm);
          padding: 15px;
          border-left: 4px solid var(--primary-color);
        }

        .remarks-box-accent h5 {
          font-size: 0.95rem;
          margin-bottom: 6px;
        }

        .remarks-box-accent p {
          font-size: 0.9rem;
          color: var(--text-light);
          margin-bottom: 0;
        }

        @media (max-width: 992px) {
          .procedure-steps-row {
            grid-template-columns: 1fr;
          }
          .form-grid-2, .preview-grids-container {
            grid-template-columns: 1fr;
          }
          .preview-sec.full-width {
            grid-column: span 1;
          }
          .status-search-form {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
