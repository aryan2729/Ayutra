"""
Clinical safety rules and validation
"""
from typing import Dict, List, Any
import logging

logger = logging.getLogger(__name__)


class ClinicalSafetyChecker:
    """Enforce clinical safety rules"""
    
    @staticmethod
    def check_safety(data: Dict[str, Any], model_output: Dict[str, Any] = None) -> List[str]:
        """
        Check clinical safety rules and return warnings
        
        Args:
            data: Patient input data
            model_output: Model prediction output (optional)
        
        Returns:
            List of warning messages
        """
        warnings = []
        
        # Rule 1: Diabetes check
        if data.get('has_diabetes') or (data.get('fasting_blood_sugar_mg_dl') and data.get('fasting_blood_sugar_mg_dl') >= 126):
            if not data.get('diabetic_friendly'):
                warnings.append("Patient has diabetes or elevated blood sugar - low GI foods recommended")
            warnings.append("low GI recommended")
        
        # Rule 2: Celiac/Gluten check
        if data.get('has_celiac') or data.get('gluten_free'):
            warnings.append("Gluten-free diet required - verify no gluten in suggested meals")
        
        # Rule 3: CKD check
        if data.get('has_ckd'):
            warnings.append("Chronic kidney disease detected - restrict potassium/phosphorus foods and verify renal diet with clinician")
        
        # Rule 4: Acidity/Reflux check
        if data.get('has_acidity_reflux'):
            warnings.append("Acidity/reflux condition - avoid spicy/acidic meals, include reflux-safe alternatives")
        
        # Rule 5: Hypertension check
        if data.get('has_hypertension'):
            if not data.get('low_sodium'):
                warnings.append("Hypertension detected - low sodium diet recommended")
        
        # Rule 6: Obesity check
        if data.get('has_obesity'):
            warnings.append("Obesity condition - calorie-controlled diet recommended")
        
        # Rule 7: Thyroid check
        if data.get('has_thyroid'):
            warnings.append("Thyroid condition - verify iodine intake with clinician")
        
        # Rule 8: PCOS/PCOD check
        if data.get('has_pcod_pcos'):
            warnings.append("PCOS/PCOD condition - consider low glycemic index and anti-inflammatory foods")
        
        # Rule 9: NAFLD check
        if data.get('has_nafld'):
            warnings.append("NAFLD condition - avoid high fructose and processed foods")
        
        # Rule 10: IBS/IBD check
        if data.get('has_ibs_ibd'):
            warnings.append("IBS/IBD condition - consider low FODMAP options and verify with gastroenterologist")
        
        # Rule 11: Dyslipidemia check
        if data.get('has_dyslipidemia'):
            warnings.append("Dyslipidemia condition - heart-healthy diet with controlled saturated fats recommended")
        
        return warnings
    
    @staticmethod
    def sanitize_diet_plan(diet_plan: Dict[str, Any], data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Sanitize diet plan based on clinical conditions
        
        Args:
            diet_plan: Generated diet plan
            data: Patient input data
        
        Returns:
            Sanitized diet plan
        """
        if not diet_plan:
            return diet_plan
        
        # Remove gluten if celiac or gluten_free
        if data.get('has_celiac') or data.get('gluten_free'):
            if 'meals' in diet_plan:
                for meal in diet_plan.get('meals', []):
                    if 'ingredients' in meal:
                        meal['ingredients'] = [
                            ing for ing in meal['ingredients'] 
                            if 'gluten' not in str(ing).lower() and 'wheat' not in str(ing).lower()
                        ]
                    if 'shopping_list' in diet_plan:
                        diet_plan['shopping_list'] = [
                            item for item in diet_plan['shopping_list']
                            if 'gluten' not in str(item).lower() and 'wheat' not in str(item).lower()
                        ]
        
        # Remove nuts if nut_free
        if data.get('nut_free'):
            if 'meals' in diet_plan:
                for meal in diet_plan.get('meals', []):
                    if 'ingredients' in meal:
                        meal['ingredients'] = [
                            ing for ing in meal['ingredients']
                            if 'nut' not in str(ing).lower() and 'peanut' not in str(ing).lower()
                        ]
        
        # Remove dairy if dairy_free
        if data.get('dairy_free'):
            if 'meals' in diet_plan:
                for meal in diet_plan.get('meals', []):
                    if 'ingredients' in meal:
                        meal['ingredients'] = [
                            ing for ing in meal['ingredients']
                            if 'dairy' not in str(ing).lower() and 'milk' not in str(ing).lower() and 'cheese' not in str(ing).lower()
                        ]
        
        # Add exclude_ingredients filter
        exclude_list = data.get('exclude_ingredients', [])
        if exclude_list:
            if 'meals' in diet_plan:
                for meal in diet_plan.get('meals', []):
                    if 'ingredients' in meal:
                        meal['ingredients'] = [
                            ing for ing in meal['ingredients']
                            if not any(excluded.lower() in str(ing).lower() for excluded in exclude_list)
                        ]
        
        # Add clinical notes
        if 'notes' not in diet_plan:
            diet_plan['notes'] = []
        
        if data.get('has_ckd'):
            diet_plan['notes'].append("Verify renal diet with clinician")
        
        if data.get('has_diabetes'):
            diet_plan['notes'].append("Monitor blood glucose levels")
        
        return diet_plan
