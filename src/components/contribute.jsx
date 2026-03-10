import { useEffect, useState, useCallback } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import {
   Container,
   Typography,
   Box,
   TextField,
   Select,
   MenuItem,
   FormControl,
   InputLabel,
   Button,
   Table,
   TableHead,
   TableRow,
   TableCell,
   TableBody,
   Paper,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   FormControlLabel,
   Checkbox,
   Stack,
   Snackbar,
   Alert
} from "@mui/material";

// Separate component to prevent re-renders
function PersonForm({ data, setter, isEdit, onAddSpouse, onAddChild, errors }) {
   const handleChange = useCallback((e) => {
      const { name, value } = e.target;
      setter(prev => ({ ...prev, [name]: value }));
   }, [setter]);

   const handleBurialChange = useCallback((field, value) => {
      setter(prev => ({
         ...prev,
         burial: { ...prev.burial, [field]: value }
      }));
   }, [setter]);

   const handleSpouseChange = useCallback((index, field, value) => {
      setter(prev => {
         const updated = [...prev.spouses];
         if (field === "burialPlace" || field === "burialMap") {
            updated[index].burial = updated[index].burial || {};
            updated[index].burial[field === "burialPlace" ? "place" : "map"] = value;
         } else {
            updated[index][field] = value;
         }
         return { ...prev, spouses: updated };
      });
   }, [setter]);

   const handleChildChange = useCallback((index, field, value) => {
      setter(prev => {
         const updated = [...prev.children];
         updated[index][field] = value;
         return { ...prev, children: updated };
      });
   }, [setter]);

   return (
      <Stack spacing={2}>
         <TextField
            label="Full Name"
            name="name"
            value={data.name}
            onChange={handleChange}
            fullWidth
            required
            error={!!errors.name}
            helperText={errors.name}
         />

         <FormControl fullWidth error={!!errors.gender}>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
               labelId="gender-label"
               name="gender"
               value={data.gender}
               onChange={handleChange}
               label="Gender"
            >
               <MenuItem value="Male">Male</MenuItem>
               <MenuItem value="Female">Female</MenuItem>
               <MenuItem value="Other">Other</MenuItem>
            </Select>
            {errors.gender && <Typography sx={{ fontSize: "0.75rem", color: "#d32f2f", mt: 0.5 }}>{errors.gender}</Typography>}
         </FormControl>

         <FormControlLabel
            control={
               <Checkbox
                  checked={data.alive === true || data.alive === "true"}
                  onChange={(e) => setter(prev => ({ ...prev, alive: e.target.checked }))}
               />
            }
            label="Alive"
         />

         <TextField
            type="date"
            label="DOB"
            name="dob"
            value={data.dob}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
         />

         <TextField
            type="date"
            label="DOD"
            name="dod"
            value={data.dod}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
         />

         <TextField
            label="Place"
            name="place"
            value={data.place}
            onChange={handleChange}
            fullWidth
         />

         <TextField
            label="About"
            name="about"
            value={data.about}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
         />

         <Typography variant="h6">Burial</Typography>
         <TextField
            label="Burial Place"
            value={data.burial?.place || ""}
            onChange={(e) => handleBurialChange("place", e.target.value)}
            fullWidth
         />
         <TextField
            label="Burial Map"
            value={data.burial?.map || ""}
            onChange={(e) => handleBurialChange("map", e.target.value)}
            fullWidth
         />

         <Typography variant="h6">Spouses</Typography>
         {data.spouses.map((spouse, idx) => (
            <Box key={`spouse-${data.name}-${idx}`} sx={{ p: 2, border: "1px solid #ddd", borderRadius: 1 }}>
               <TextField
                  label="Spouse Name"
                  fullWidth
                  value={spouse.name}
                  onChange={(e) => handleSpouseChange(idx, "name", e.target.value)}
                  sx={{ mb: 1 }}
               />
               <TextField
                  label="Father Name"
                  fullWidth
                  value={spouse.fname}
                  onChange={(e) => handleSpouseChange(idx, "fname", e.target.value)}
                  sx={{ mb: 1 }}
               />
               <FormControl fullWidth sx={{ mb: 1 }}>
                  <InputLabel id={`spouse-gender-${idx}`}>Gender</InputLabel>
                  <Select
                     labelId={`spouse-gender-${idx}`}
                     value={spouse.gender}
                     onChange={(e) => handleSpouseChange(idx, "gender", e.target.value)}
                     label="Gender"
                  >
                     <MenuItem value="Male">Male</MenuItem>
                     <MenuItem value="Female">Female</MenuItem>
                     <MenuItem value="Other">Other</MenuItem>
                  </Select>
               </FormControl>
               <FormControlLabel
                  control={
                     <Checkbox
                        checked={spouse.alive === true || spouse.alive === "true"}
                        onChange={(e) => handleSpouseChange(idx, "alive", e.target.checked)}
                     />
                  }
                  label="Alive"
               />
               <TextField
                  type="date"
                  label="DOB"
                  fullWidth
                  value={spouse.dob}
                  onChange={(e) => handleSpouseChange(idx, "dob", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 1 }}
               />
               <TextField
                  type="date"
                  label="DOD"
                  fullWidth
                  value={spouse.dod}
                  onChange={(e) => handleSpouseChange(idx, "dod", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 1 }}
               />
               <TextField
                  label="Place"
                  fullWidth
                  value={spouse.place}
                  onChange={(e) => handleSpouseChange(idx, "place", e.target.value)}
                  sx={{ mb: 1 }}
               />
               <TextField
                  label="About"
                  fullWidth
                  value={spouse.about}
                  onChange={(e) => handleSpouseChange(idx, "about", e.target.value)}
                  sx={{ mb: 1 }}
               />
               <TextField
                  label="Burial Place"
                  fullWidth
                  value={spouse.burial?.place || ""}
                  onChange={(e) => handleSpouseChange(idx, "burialPlace", e.target.value)}
                  sx={{ mb: 1 }}
               />
               <TextField
                  label="Burial Map"
                  fullWidth
                  value={spouse.burial?.map || ""}
                  onChange={(e) => handleSpouseChange(idx, "burialMap", e.target.value)}
               />
            </Box>
         ))}

         <Typography variant="h6">Children</Typography>
         {data.children.map((child, idx) => (
            <Box key={`child-${data.name}-${idx}`} sx={{ p: 2, border: "1px solid #ddd", borderRadius: 1 }}>
               <TextField
                  label="Child Name"
                  fullWidth
                  value={child.name}
                  onChange={(e) => handleChildChange(idx, "name", e.target.value)}
                  sx={{ mb: 1 }}
               />
               <FormControl fullWidth sx={{ mb: 1 }}>
                  <InputLabel id={`child-gender-${idx}`}>Gender</InputLabel>
                  <Select
                     labelId={`child-gender-${idx}`}
                     value={child.gender}
                     onChange={(e) => handleChildChange(idx, "gender", e.target.value)}
                     label="Gender"
                  >
                     <MenuItem value="Male">Male</MenuItem>
                     <MenuItem value="Female">Female</MenuItem>
                     <MenuItem value="Other">Other</MenuItem>
                  </Select>
               </FormControl>
               <TextField
                  type="date"
                  label="DOB"
                  fullWidth
                  value={child.dob}
                  onChange={(e) => handleChildChange(idx, "dob", e.target.value)}
                  InputLabelProps={{ shrink: true }}
               />
            </Box>
         ))}

         <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" onClick={onAddSpouse}>
               Add Spouse
            </Button>
            <Button variant="outlined" onClick={onAddChild}>
               Add Child
            </Button>
         </Box>
      </Stack>
   );
}

export default function Contribute() {
   const families = ["mirani", "hashmi", "ansari"];

   const emptyPerson = {
      family: "",
      name: "",
      gender: "",
      alive: true,
      dob: "",
      dod: "",
      place: "",
      about: "",
      burial: { place: "", map: "" },
      spouses: [],
      children: []
   };

   const [selectedFamily, setSelectedFamily] = useState("");
   const [formData, setFormData] = useState(emptyPerson);
   const [persons, setPersons] = useState([]);
   const [editData, setEditData] = useState(null);
   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
   const [formErrors, setFormErrors] = useState({ name: "", gender: "" });
   const [editFormErrors, setEditFormErrors] = useState({ name: "", gender: "" });

   const personsRef = collection(db, "persons");

   // Validate form on formData change
   useEffect(() => {
      const errors = { name: "", gender: "" };
      if (!formData.name || !formData.name.trim()) {
         errors.name = "Name is mandatory";
      }
      if (!formData.gender || !formData.gender.trim()) {
         errors.gender = "Gender is mandatory";
      }
      setFormErrors(errors);
   }, [formData.name, formData.gender]);

   // Validate edit form on editData change
   useEffect(() => {
      if (editData) {
         const errors = { name: "", gender: "" };
         if (!editData.name || !editData.name.trim()) {
            errors.name = "Name is mandatory";
         }
         if (!editData.gender || !editData.gender.trim()) {
            errors.gender = "Gender is mandatory";
         }
         setEditFormErrors(errors);
      }
   }, [editData?.name, editData?.gender]);

   useEffect(() => {
      loadPersons();
   }, []);

   const loadPersons = async () => {
      const data = await getDocs(personsRef);
      setPersons(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
   };

   const handleFamilySelect = (e) => {
      const family = e.target.value;
      setSelectedFamily(family);
      setFormData({ ...emptyPerson, family });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      // Check if there are any validation errors
      if (formErrors.name || formErrors.gender) {
         setSnackbar({ open: true, message: "Please fill all required fields", severity: "error" });
         return;
      }

      await addDoc(personsRef, formData);
      setFormData({ ...emptyPerson, family: selectedFamily });
      loadPersons();
      setSnackbar({ open: true, message: "Person added successfully!", severity: "success" });
   };

   const handleRowClick = (person) => {
      setEditData(person);
   };

   const handleUpdate = async () => {
      const personDoc = doc(db, "persons", editData.id);
      await updateDoc(personDoc, editData);
      setEditData(null);
      loadPersons();
   };

   const addSpouseToFormData = (data) => ({
      ...data,
      spouses: [
         ...data.spouses,
         {
            name: "",
            fname: "",
            gender: "",
            alive: true,
            dob: "",
            dod: "",
            place: "",
            about: "",
            burial: { place: "", map: "" }
         }
      ]
   });

   const addChildToFormData = (data) => ({
      ...data,
      children: [...data.children, { name: "", gender: "", dob: "" }]
   });

   return (
      <Container maxWidth="md" sx={{ py: 4 }}>
         <Typography variant="h4" sx={{ mb: 3 }}>
            Contribute Family Data
         </Typography>

         {/* Family Dropdown */}
         <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id="family-select-label">Select Family</InputLabel>
            <Select
               labelId="family-select-label"
               value={selectedFamily}
               onChange={handleFamilySelect}
               label="Select Family"
            >
               {families.map((f) => (
                  <MenuItem key={f} value={f}>
                     {f.charAt(0).toUpperCase() + f.slice(1)}
                  </MenuItem>
               ))}
            </Select>
         </FormControl>

         {/* Inline Form for Adding */}
         {selectedFamily && (
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 6 }}>
               <Typography variant="h6" sx={{ mb: 2 }}>
                  Add New Person
               </Typography>
               <PersonForm
                  data={formData}
                  setter={setFormData}
                  isEdit={false}
                  onAddSpouse={() => setFormData(addSpouseToFormData(formData))}
                  onAddChild={() => setFormData(addChildToFormData(formData))}
                  errors={formErrors}
               />
               <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Button
                     variant="contained"
                     type="submit"
                     disabled={!!formErrors.name || !!formErrors.gender}
                  >
                     Submit New Person
                  </Button>
               </Box>
            </Box>
         )}

         {/* Table */}
         {selectedFamily && (
            <>
               <Typography variant="h5" sx={{ mb: 2 }}>
                  Family Members
               </Typography>
               <Paper elevation={3}>
                  <Table sx={{ minWidth: 300 }}>
                     <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableRow>
                           <TableCell>Name</TableCell>
                           <TableCell>DOB</TableCell>
                           <TableCell>Gender</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {persons
                           .filter((p) => p.family === selectedFamily)
                           .map((person) => (
                              <TableRow
                                 key={person.id}
                                 onClick={() => handleRowClick(person)}
                                 sx={{
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "#e0f7fa" }
                                 }}
                              >
                                 <TableCell>{person.name}</TableCell>
                                 <TableCell>{person.dob}</TableCell>
                                 <TableCell>{person.gender}</TableCell>
                              </TableRow>
                           ))}
                     </TableBody>
                  </Table>
               </Paper>
            </>
         )}

         {/* Edit Dialog */}
         {editData && (
            <Dialog open={!!editData} onClose={() => setEditData(null)} maxWidth="sm" fullWidth>
               <DialogTitle>Edit Person Details</DialogTitle>
               <DialogContent dividers sx={{ maxHeight: "70vh", overflow: "auto" }}>
                  <Box sx={{ pt: 2 }}>
                     <PersonForm
                        data={editData}
                        setter={setEditData}
                        isEdit={true}
                        onAddSpouse={() => setEditData(addSpouseToFormData(editData))}
                        onAddChild={() => setEditData(addChildToFormData(editData))}
                        errors={editFormErrors}
                     />
                  </Box>
               </DialogContent>
               <DialogActions sx={{ p: 2 }}>
                  <Button onClick={() => setEditData(null)}>Cancel</Button>
                  <Button
                     variant="contained"
                     onClick={handleUpdate}
                     disabled={!!editFormErrors.name || !!editFormErrors.gender}
                  >
                     Update
                  </Button>
               </DialogActions>
            </Dialog>
         )}

         {/* Success/Error Notification */}
         <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
         >
            <Alert
               onClose={() => setSnackbar({ ...snackbar, open: false })}
               severity={snackbar.severity}
               sx={{ width: "100%" }}
            >
               {snackbar.message}
            </Alert>
         </Snackbar>
      </Container>
   );
}